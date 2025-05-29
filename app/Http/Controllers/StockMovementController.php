<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with(['product', 'user']);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $movements = $query->orderByDesc('created_at')->paginate(20);
        
        $products = Product::active()->orderBy('name')->get();
        
        $types = [
            'entrada' => 'Entrada',
            'salida' => 'Salida',
            'ajuste' => 'Ajuste',
            'venta' => 'Venta',
            'compra' => 'Compra',
            'devolucion' => 'Devolución',
        ];

        return view('stock-movements.index', compact('movements', 'products', 'types'));
    }

    public function byProduct(Product $product)
    {
        $movements = StockMovement::where('product_id', $product->id)
            ->with(['user'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return view('stock-movements.by-product', compact('movements', 'product'));
    }
}