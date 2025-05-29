<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsExport;
use App\Imports\ProductsImport;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier'])
            ->when($request->search, function ($q) use ($request) {
                $q->search($request->search);
            })
            ->when($request->category_id, function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            })
            ->when($request->status, function ($q) use ($request) {
                if ($request->status === 'active') {
                    $q->where('is_active', true);
                } elseif ($request->status === 'inactive') {
                    $q->where('is_active', false);
                } elseif ($request->status === 'low_stock') {
                    $q->lowStock();
                } elseif ($request->status === 'expiring') {
                    $q->expiringSoon(7);
                }
            })
            ->when($request->sort_by, function ($q) use ($request) {
                $direction = $request->sort_direction === 'desc' ? 'desc' : 'asc';
                $q->orderBy($request->sort_by, $direction);
            }, function ($q) {
                $q->orderBy('name');
            });

        if ($request->ajax()) {
            $products = $query->paginate(20);
            return response()->json([
                'products' => $products->items(),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'total' => $products->total(),
                ]
            ]);
        }

        $products = $query->paginate(20);
        $categories = Category::active()->orderBy('name')->get();
        $suppliers = Supplier::active()->orderBy('name')->get();

        return view('products.index', compact('products', 'categories', 'suppliers'));
    }

    public function create()
    {
        $categories = Category::active()->orderBy('name')->get();
        $suppliers = Supplier::active()->orderBy('name')->get();
        
        return view('products.create', compact('categories', 'suppliers'));
    }

    public function store(ProductRequest $request)
    {
        $data = $request->validated();
        
        // Manejar imagen
        if ($request->hasFile('image')) {
            $data['image_path'] = $this->handleImageUpload($request->file('image'));
        }

        $product = Product::create($data);

        // Registrar movimiento inicial de stock si hay cantidad
        if ($product->stock_quantity > 0) {
            $product->updateStock(
                $product->stock_quantity, 
                'entrada', 
                'ajuste_inventario',
                null,
                auth()->user()
            );
        }

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'product' => $product->load(['category', 'supplier'])
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', 'Producto creado exitosamente');
    }

    public function show(Product $product)
    {
        $product->load(['category', 'supplier', 'stockMovements.user']);
        
        // Estadísticas del producto
        $stats = [
            'total_sold_month' => $product->getTotalSold('month'),
            'total_sold_week' => $product->getTotalSold('week'),
            'total_sold_today' => $product->getTotalSold('today'),
            'stock_value' => $product->getStockValue(),
            'last_sale' => $product->saleItems()
                ->whereHas('sale', fn($q) => $q->completed())
                ->with('sale')
                ->latest()
                ->first()?->sale,
            'last_purchase' => $product->purchaseItems()
                ->with('purchase')
                ->latest()
                ->first()?->purchase,
        ];

        return view('products.show', compact('product', 'stats'));
    }

    public function edit(Product $product)
    {
        $categories = Category::active()->orderBy('name')->get();
        $suppliers = Supplier::active()->orderBy('name')->get();
        
        return view('products.edit', compact('product', 'categories', 'suppliers'));
    }

    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();
        
        // Manejar imagen
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $this->handleImageUpload($request->file('image'));
        }

        $oldStock = $product->stock_quantity;
        $product->update($data);

        // Si cambió el stock, registrar movimiento
        if ($oldStock != $product->stock_quantity) {
            $difference = $product->stock_quantity - $oldStock;
            $type = $difference > 0 ? 'entrada' : 'salida';
            $product->updateStock(
                abs($difference),
                $type,
                'ajuste_inventario',
                null,
                auth()->user()
            );
        }

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'product' => $product->load(['category', 'supplier'])
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', 'Producto actualizado exitosamente');
    }

    public function destroy(Product $product)
    {
        // Verificar si el producto tiene ventas
        if ($product->saleItems()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar un producto que tiene ventas registradas'
            ], 422);
        }

        // Eliminar imagen
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado exitosamente'
        ]);
    }

    public function updateStock(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|numeric',
            'type' => 'required|in:entrada,salida,ajuste',
            'reason' => 'required|string',
            'notes' => 'nullable|string|max:500'
        ]);

        $product->updateStock(
            $request->quantity,
            $request->type,
            $request->reason,
            null,
            auth()->user()
        );

        return response()->json([
            'success' => true,
            'message' => 'Stock actualizado exitosamente',
            'new_stock' => $product->fresh()->stock_quantity
        ]);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['category_id', 'status', 'search']);
        
        return Excel::download(
            new ProductsExport($filters), 
            'productos_' . now()->format('Y-m-d_H-i-s') . '.xlsx'
        );
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            Excel::import(new ProductsImport, $request->file('file'));
            
            return response()->json([
                'success' => true,
                'message' => 'Productos importados exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al importar productos: ' . $e->getMessage()
            ], 422);
        }
    }

    public function search(Request $request)
    {
        $term = $request->get('q');
        
        $products = Product::active()
            ->search($term)
            ->with('category')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'text' => $product->name . ' (' . $product->code . ')',
                    'name' => $product->name,
                    'code' => $product->code,
                    'price' => $product->sale_price,
                    'stock' => $product->stock_quantity,
                    'unit' => $product->unit,
                    'category' => $product->category->name,
                    'image_url' => $product->image_url,
                ];
            });

        return response()->json($products);
    }

    private function handleImageUpload($file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('products', $filename, 'public');
        
        return $path;
    }
}