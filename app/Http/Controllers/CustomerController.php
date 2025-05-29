<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $customers = $query->withCount('sales')
            ->withSum('sales as total_purchases', 'total_amount')
            ->orderBy('name')
            ->paginate(15);

        return view('customers.index', compact('customers'));
    }

    public function create()
    {
        return view('customers.create');
    }

    public function store(CustomerRequest $request)
    {
        try {
            DB::beginTransaction();

            $customer = Customer::create($request->validated());

            DB::commit();

            return redirect()->route('customers.index')
                ->with('success', 'Cliente creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al crear el cliente: ' . $e->getMessage());
        }
    }

    public function show(Customer $customer)
    {
        $customer->load(['sales' => function ($query) {
            $query->with('items.product')->latest()->limit(10);
        }]);

        $stats = [
            'total_purchases' => $customer->sales()->completed()->sum('total_amount'),
            'total_orders' => $customer->sales()->completed()->count(),
            'average_order' => $customer->sales()->completed()->avg('total_amount') ?? 0,
            'last_purchase' => $customer->sales()->completed()->latest()->first()?->sale_date,
        ];

        return view('customers.show', compact('customer', 'stats'));
    }

    public function edit(Customer $customer)
    {
        return view('customers.edit', compact('customer'));
    }

    public function update(CustomerRequest $request, Customer $customer)
    {
        try {
            DB::beginTransaction();

            $customer->update($request->validated());

            DB::commit();

            return redirect()->route('customers.index')
                ->with('success', 'Cliente actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al actualizar el cliente: ' . $e->getMessage());
        }
    }

    public function destroy(Customer $customer)
    {
        try {
            if ($customer->sales()->exists()) {
                return back()->with('error', 'No se puede eliminar el cliente porque tiene ventas asociadas.');
            }

            $customer->delete();

            return redirect()->route('customers.index')
                ->with('success', 'Cliente eliminado exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el cliente: ' . $e->getMessage());
        }
    }
}