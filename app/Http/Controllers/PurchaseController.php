<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Product;
use App\Models\Supplier;
use App\Http\Requests\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'user', 'items'])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('purchase_number', 'like', "%{$request->search}%")
                          ->orWhere('supplier_invoice_number', 'like', "%{$request->search}%")
                          ->orWhereHas('supplier', function ($q) use ($request) {
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
            ->when($request->supplier_id, function ($q) use ($request) {
                $q->where('supplier_id', $request->supplier_id);
            })
            ->when($request->date_from, function ($q) use ($request) {
                $q->whereDate('purchase_date', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($q) use ($request) {
                $q->whereDate('purchase_date', '<=', $request->date_to);
            })
            ->orderByDesc('purchase_date');

        if ($request->ajax()) {
            $purchases = $query->paginate(20);
            return response()->json([
                'purchases' => $purchases->items(),
                'pagination' => [
                    'current_page' => $purchases->currentPage(),
                    'last_page' => $purchases->lastPage(),
                    'total' => $purchases->total(),
                ]
            ]);
        }

        $purchases = $query->paginate(20);
        $suppliers = Supplier::active()->orderBy('name')->get();
        $stats = $this->getPurchaseStats();

        return view('purchases.index', compact('purchases', 'suppliers', 'stats'));
    }

    public function create()
    {
        $suppliers = Supplier::active()->orderBy('name')->get();
        $products = Product::active()->with('category')->orderBy('name')->get();

        return view('purchases.create', compact('suppliers', 'products'));
    }

    public function store(PurchaseRequest $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['user_id'] = auth()->id();
            $data['purchase_date'] = now();
            $data['purchase_number'] = $this->generatePurchaseNumber();

            // Crear la compra
            $purchase = Purchase::create($data);

            $subtotal = 0;

            // Agregar productos
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                $itemSubtotal = $item['quantity'] * $item['unit_cost'];
                $discountAmount = $itemSubtotal * ($item['discount_percentage'] ?? 0) / 100;
                $itemTotal = $itemSubtotal - $discountAmount;

                // Crear item de compra
                $purchase->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'unit_cost' => $item['unit_cost'],
                    'quantity' => $item['quantity'],
                    'unit' => $product->unit,
                    'expiry_date' => $item['expiry_date'] ?? null,
                    'batch_number' => $item['batch_number'] ?? null,
                    'subtotal' => $itemSubtotal,
                    'discount_amount' => $discountAmount,
                    'total' => $itemTotal,
                ]);

                $subtotal += $itemTotal;

                // Actualizar stock del producto
                $product->updateStock(
                    $item['quantity'],
                    'entrada',
                    'compra',
                    $purchase
                );

                // Actualizar precio de costo si es diferente
                if ($product->cost_price != $item['unit_cost']) {
                    $product->update(['cost_price' => $item['unit_cost']]);
                }
            }

            // Calcular totales
            $taxAmount = $subtotal * 0.21; // 21% IVA
            $totalAmount = $subtotal + $taxAmount - ($request->discount_amount ?? 0);

            $purchase->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
            ]);

            DB::commit();

            if ($request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Compra registrada exitosamente',
                    'purchase' => $purchase->load(['supplier', 'items.product']),
                    'redirect_url' => route('purchases.show', $purchase)
                ]);
            }

            return redirect()->route('purchases.show', $purchase)
                ->with('success', 'Compra registrada exitosamente');

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

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'user', 'items.product.category']);
        
        return view('purchases.show', compact('purchase'));
    }

    public function edit(Purchase $purchase)
    {
        if (!in_array($purchase->status, ['borrador', 'ordenada'])) {
            return redirect()->route('purchases.show', $purchase)
                ->with('error', 'Solo se pueden editar compras en estado borrador u ordenada');
        }

        $purchase->load(['supplier', 'items.product']);
        $suppliers = Supplier::active()->orderBy('name')->get();
        $products = Product::active()->with('category')->orderBy('name')->get();

        return view('purchases.edit', compact('purchase', 'suppliers', 'products'));
    }

    public function update(PurchaseRequest $request, Purchase $purchase)
    {
        if (!in_array($purchase->status, ['borrador', 'ordenada'])) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden editar compras en estado borrador u ordenada'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Si la compra ya fue recibida, restaurar stock
            if ($purchase->status === 'recibida') {
                foreach ($purchase->items as $item) {
                    $item->product->updateStock(
                        $item->quantity,
                        'salida',
                        'ajuste_inventario',
                        $purchase
                    );
                }
            }

            // Eliminar items anteriores
            $purchase->items()->delete();

            // Actualizar datos de la compra
            $purchase->update($request->validated());

            $subtotal = 0;

            // Agregar nuevos items
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                $itemSubtotal = $item['quantity'] * $item['unit_cost'];
                $discountAmount = $itemSubtotal * ($item['discount_percentage'] ?? 0) / 100;
                $itemTotal = $itemSubtotal - $discountAmount;

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'unit_cost' => $item['unit_cost'],
                    'quantity' => $item['quantity'],
                    'unit' => $product->unit,
                    'expiry_date' => $item['expiry_date'] ?? null,
                    'batch_number' => $item['batch_number'] ?? null,
                    'subtotal' => $itemSubtotal,
                    'discount_amount' => $discountAmount,
                    'total' => $itemTotal,
                ]);

                $subtotal += $itemTotal;

                // Actualizar stock si la compra está recibida
                if ($purchase->status === 'recibida') {
                    $product->updateStock(
                        $item['quantity'],
                        'entrada',
                        'compra',
                        $purchase
                    );
                }
            }

            // Recalcular totales
            $taxAmount = $subtotal * 0.21;
            $totalAmount = $subtotal + $taxAmount - ($request->discount_amount ?? 0);

            $purchase->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra actualizada exitosamente',
                'purchase' => $purchase->fresh()->load(['supplier', 'items.product'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function updateStatus(Request $request, Purchase $purchase)
    {
        $request->validate([
            'status' => 'required|in:borrador,ordenada,recibida,facturada,pagada,cancelada',
            'notes' => 'nullable|string|max:500'
        ]);

        $oldStatus = $purchase->status;
        $newStatus = $request->status;

        // Validar transiciones de estado
        $validTransitions = [
            'borrador' => ['ordenada', 'cancelada'],
            'ordenada' => ['recibida', 'cancelada'],
            'recibida' => ['facturada', 'pagada'],
            'facturada' => ['pagada'],
            'pagada' => [],
            'cancelada' => []
        ];

        if (!in_array($newStatus, $validTransitions[$oldStatus])) {
            return response()->json([
                'success' => false,
                'message' => "No se puede cambiar de estado {$oldStatus} a {$newStatus}"
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Si se marca como recibida, actualizar stock
            if ($newStatus === 'recibida' && $oldStatus !== 'recibida') {
                foreach ($purchase->items as $item) {
                    $item->product->updateStock(
                        $item->quantity,
                        'entrada',
                        'compra',
                        $purchase
                    );
                }
                $purchase->received_date = now();
            }

            // Si se marca como pagada
            if ($newStatus === 'pagada') {
                $purchase->paid_date = now();
                $purchase->payment_status = 'pagado';
                $purchase->amount_paid = $purchase->total_amount;
            }

            $purchase->status = $newStatus;
            if ($request->notes) {
                $purchase->notes = ($purchase->notes ?? '') . "\n" . now()->format('d/m/Y H:i') . ': ' . $request->notes;
            }
            $purchase->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado exitosamente',
                'purchase' => $purchase->fresh()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(Purchase $purchase)
    {
        if ($purchase->status === 'recibida') {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar una compra que ya fue recibida'
            ], 422);
        }

        $purchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Compra eliminada exitosamente'
        ]);
    }

    private function generatePurchaseNumber(): string
    {
        $lastPurchase = Purchase::latest('id')->first();
        $nextNumber = $lastPurchase ? $lastPurchase->id + 1 : 1;
        
        return 'COMP-' . str_pad($nextNumber, 8, '0', STR_PAD_LEFT);
    }

    private function getPurchaseStats(): array
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'today' => [
                'count' => Purchase::whereDate('purchase_date', $today)->count(),
                'total' => Purchase::whereDate('purchase_date', $today)->sum('total_amount'),
            ],
            'week' => [
                'count' => Purchase::where('purchase_date', '>=', $thisWeek)->count(),
                'total' => Purchase::where('purchase_date', '>=', $thisWeek)->sum('total_amount'),
            ],
            'month' => [
                'count' => Purchase::where('purchase_date', '>=', $thisMonth)->count(),
                'total' => Purchase::where('purchase_date', '>=', $thisMonth)->sum('total_amount'),
            ],
            'pending_payment' => [
                'count' => Purchase::where('payment_status', 'pendiente')->count(),
                'total' => Purchase::where('payment_status', 'pendiente')->sum('total_amount'),
            ]
        ];
    }
}