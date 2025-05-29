<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use App\Http\Requests\SaleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'user', 'items'])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('invoice_number', 'like', "%{$request->search}%")
                          ->orWhereHas('customer', function ($q) use ($request) {
                              $q->where('name', 'like', "%{$request->search}%");
                          });
                });
            })
            ->when($request->status, function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->when($request->payment_status, function ($q) use ($request) {
                $q->where('payment_status', $request->payment_status);
            })
            ->when($request->payment_method, function ($q) use ($request) {
                $q->where('payment_method', $request->payment_method);
            })
            ->when($request->date_from, function ($q) use ($request) {
                $q->whereDate('sale_date', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($q) use ($request) {
                $q->whereDate('sale_date', '<=', $request->date_to);
            })
            ->orderByDesc('sale_date');

        if ($request->ajax()) {
            $sales = $query->paginate(20);
            return response()->json([
                'sales' => $sales->items(),
                'pagination' => [
                    'current_page' => $sales->currentPage(),
                    'last_page' => $sales->lastPage(),
                    'total' => $sales->total(),
                ]
            ]);
        }

        $sales = $query->paginate(20);
        
        // Estadísticas para el dashboard de ventas
        $stats = $this->getSalesStats();

        return view('sales.index', compact('sales', 'stats'));
    }

    public function create()
    {
        $customers = Customer::active()->orderBy('name')->get();
        $recentProducts = Product::active()
            ->withSum(['saleItems as recent_sales' => function ($query) {
                $query->whereHas('sale', function ($q) {
                    $q->completed()->where('sale_date', '>=', Carbon::now()->subDays(30));
                });
            }], 'quantity')
            ->orderByDesc('recent_sales')
            ->limit(10)
            ->get();

        return view('sales.create', compact('customers', 'recentProducts'));
    }

    public function store(SaleRequest $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['user_id'] = auth()->id();
            $data['sale_date'] = now();

            // Crear la venta
            $sale = Sale::create($data);

            // Agregar productos
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Verificar stock disponible
                if ($product->track_stock && $product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para {$product->name}. Disponible: {$product->stock_quantity}");
                }

                $sale->addItem(
                    $product,
                    $item['quantity'],
                    $item['unit_price'] ?? null,
                    $item['discount_percentage'] ?? 0
                );
            }

            // Aplicar descuento general si existe
            if ($request->discount_percentage > 0) {
                $sale->update(['discount_percentage' => $request->discount_percentage]);
                $sale->calculateTotals();
            }

            DB::commit();

            if ($request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Venta registrada exitosamente',
                    'sale' => $sale->load(['customer', 'items.product']),
                    'redirect_url' => route('sales.show', $sale)
                ]);
            }

            return redirect()->route('sales.show', $sale)
                ->with('success', 'Venta registrada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 422);
            }

            return back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'user', 'items.product.category']);
        
        return view('sales.show', compact('sale'));
    }

    public function edit(Sale $sale)
    {
        if ($sale->status !== 'borrador') {
            return redirect()->route('sales.show', $sale)
                ->with('error', 'Solo se pueden editar ventas en estado borrador');
        }

        $sale->load(['customer', 'items.product']);
        $customers = Customer::active()->orderBy('name')->get();

        return view('sales.edit', compact('sale', 'customers'));
    }

    public function update(SaleRequest $request, Sale $sale)
    {
        if ($sale->status !== 'borrador') {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden editar ventas en estado borrador'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Restaurar stock de los items anteriores
            foreach ($sale->items as $item) {
                $item->product->updateStock(
                    $item->quantity,
                    'entrada',
                    'devolucion',
                    $sale
                );
            }

            // Eliminar items anteriores
            $sale->items()->delete();

            // Actualizar datos de la venta
            $sale->update($request->validated());

            // Agregar nuevos items
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->track_stock && $product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para {$product->name}");
                }

                $sale->addItem(
                    $product,
                    $item['quantity'],
                    $item['unit_price'] ?? null,
                    $item['discount_percentage'] ?? 0
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta actualizada exitosamente',
                'sale' => $sale->fresh()->load(['customer', 'items.product'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function cancel(Request $request, Sale $sale)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        if ($sale->status === 'cancelada') {
            return response()->json([
                'success' => false,
                'message' => 'La venta ya está cancelada'
            ], 422);
        }

        $sale->cancel($request->reason);

        return response()->json([
            'success' => true,
            'message' => 'Venta cancelada exitosamente'
        ]);
    }

    public function generatePdf(Sale $sale)
    {
        $sale->load(['customer', 'user', 'items.product.category']);
        
        $pdf = Pdf::loadView('sales.pdf', compact('sale'));
        
        return $pdf->download("venta_{$sale->invoice_number}.pdf");
    }

    public function print(Sale $sale)
    {
        $sale->load(['customer', 'user', 'items.product.category']);
        
        return view('sales.print', compact('sale'));
    }

    public function getDailySales(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();
        
        $sales = Sale::completed()
            ->whereDate('sale_date', $date)
            ->with(['customer', 'user', 'items'])
            ->orderByDesc('sale_date')
            ->get();

        $stats = [
            'total_sales' => $sales->sum('total_amount'),
            'total_profit' => $sales->sum('total_profit'),
            'sales_count' => $sales->count(),
            'average_sale' => $sales->count() > 0 ? $sales->avg('total_amount') : 0,
            'payment_methods' => $sales->groupBy('payment_method')
                ->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'total' => $group->sum('total_amount')
                    ];
                })
        ];

        return response()->json([
            'sales' => $sales,
            'stats' => $stats
        ]);
    }

    public function quickSale(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.001',
            'payment_method' => 'required|in:efectivo,tarjeta_debito,tarjeta_credito,transferencia'
        ]);

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($request->product_id);
            
            if ($product->track_stock && $product->stock_quantity < $request->quantity) {
                throw new \Exception("Stock insuficiente. Disponible: {$product->stock_quantity}");
            }

            // Crear venta rápida
            $sale = Sale::create([
                'invoice_type' => 'ticket',
                'user_id' => auth()->id(),
                'payment_method' => $request->payment_method,
                'sale_date' => now(),
                'subtotal' => 0,
                'total_amount' => 0,
                'amount_paid' => 0,
                'status' => 'completada',
                'payment_status' => 'pagado'
            ]);

            // Agregar el producto
            $sale->addItem($product, $request->quantity);

            // Actualizar el pago
            $sale->update([
                'amount_paid' => $sale->total_amount,
                'change_amount' => max(0, $sale->amount_paid - $sale->total_amount)
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta rápida registrada exitosamente',
                'sale' => $sale->load(['items.product'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    private function getSalesStats(): array
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'today' => [
                'count' => Sale::completed()->whereDate('sale_date', $today)->count(),
                'total' => Sale::completed()->whereDate('sale_date', $today)->sum('total_amount'),
                'profit' => Sale::completed()->whereDate('sale_date', $today)->get()->sum('total_profit')
            ],
            'week' => [
                'count' => Sale::completed()->where('sale_date', '>=', $thisWeek)->count(),
                'total' => Sale::completed()->where('sale_date', '>=', $thisWeek)->sum('total_amount'),
                'profit' => Sale::completed()->where('sale_date', '>=', $thisWeek)->get()->sum('total_profit')
            ],
            'month' => [
                'count' => Sale::completed()->where('sale_date', '>=', $thisMonth)->count(),
                'total' => Sale::completed()->where('sale_date', '>=', $thisMonth)->sum('total_amount'),
                'profit' => Sale::completed()->where('sale_date', '>=', $thisMonth)->get()->sum('total_profit')
            ]
        ];
    }
}