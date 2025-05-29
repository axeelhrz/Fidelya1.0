<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\SupplierRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $suppliers = $query->withCount('purchases')
            ->withSum('purchases as total_purchases', 'total_amount')
            ->orderBy('name')
            ->paginate(15);

        return view('suppliers.index', compact('suppliers'));
    }

    public function create()
    {
        return view('suppliers.create');
    }

    public function store(SupplierRequest $request)
    {
        try {
            DB::beginTransaction();

            $supplier = Supplier::create($request->validated());

            DB::commit();

            return redirect()->route('suppliers.index')
                ->with('success', 'Proveedor creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al crear el proveedor: ' . $e->getMessage());
        }
    }

    public function show(Supplier $supplier)
    {
        $supplier->load(['purchases' => function ($query) {
            $query->with('items.product')->latest()->limit(10);
        }]);

        $stats = [
            'total_purchases' => $supplier->purchases()->sum('total_amount'),
            'total_orders' => $supplier->purchases()->count(),
            'average_order' => $supplier->purchases()->avg('total_amount') ?? 0,
            'last_purchase' => $supplier->purchases()->latest()->first()?->purchase_date,
        ];

        return view('suppliers.show', compact('supplier', 'stats'));
    }

    public function edit(Supplier $supplier)
    {
        return view('suppliers.edit', compact('supplier'));
    }

    public function update(SupplierRequest $request, Supplier $supplier)
    {
        try {
            DB::beginTransaction();

            $supplier->update($request->validated());

            DB::commit();

            return redirect()->route('suppliers.index')
                ->with('success', 'Proveedor actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al actualizar el proveedor: ' . $e->getMessage());
        }
    }

    public function destroy(Supplier $supplier)
    {
        try {
            if ($supplier->purchases()->exists()) {
                return back()->with('error', 'No se puede eliminar el proveedor porque tiene compras asociadas.');
            }

            $supplier->delete();

            return redirect()->route('suppliers.index')
                ->with('success', 'Proveedor eliminado exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el proveedor: ' . $e->getMessage());
        }
    }
}