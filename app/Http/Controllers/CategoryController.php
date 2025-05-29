<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $categories = $query->withCount('products')
            ->orderBy('name')
            ->paginate(15);

        return view('categories.index', compact('categories'));
    }

    public function create()
    {
        return view('categories.create');
    }

    public function store(CategoryRequest $request)
    {
        try {
            DB::beginTransaction();

            $category = Category::create($request->validated());

            DB::commit();

            return redirect()->route('categories.index')
                ->with('success', 'Categoría creada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al crear la categoría: ' . $e->getMessage());
        }
    }

    public function show(Category $category)
    {
        $category->load(['products' => function ($query) {
            $query->active()->with('category')->latest()->limit(20);
        }]);

        $stats = [
            'total_products' => $category->products()->active()->count(),
            'total_stock_value' => $category->products()->active()->sum(DB::raw('stock_quantity * cost_price')),
            'low_stock_products' => $category->products()->lowStock()->count(),
        ];

        return view('categories.show', compact('category', 'stats'));
    }

    public function edit(Category $category)
    {
        return view('categories.edit', compact('category'));
    }

    public function update(CategoryRequest $request, Category $category)
    {
        try {
            DB::beginTransaction();

            $category->update($request->validated());

            DB::commit();

            return redirect()->route('categories.index')
                ->with('success', 'Categoría actualizada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al actualizar la categoría: ' . $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            if ($category->products()->exists()) {
                return back()->with('error', 'No se puede eliminar la categoría porque tiene productos asociados.');
            }

            $category->delete();

            return redirect()->route('categories.index')
                ->with('success', 'Categoría eliminada exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar la categoría: ' . $e->getMessage());
        }
    }
}