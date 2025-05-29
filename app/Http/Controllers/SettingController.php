<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = CompanySetting::first() ?? new CompanySetting();
        return view('settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string|max:500',
            'company_phone' => 'required|string|max:20',
            'company_email' => 'required|email|max:255',
            'company_tax_id' => 'required|string|max:50',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'currency' => 'required|string|max:10',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'low_stock_threshold' => 'required|integer|min:0',
            'invoice_prefix' => 'required|string|max:10',
            'invoice_footer' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $settings = CompanySetting::first() ?? new CompanySetting();
            
            $data = $request->except(['company_logo']);

            // Manejar la subida del logo
            if ($request->hasFile('company_logo')) {
                // Eliminar logo anterior si existe
                if ($settings->company_logo && Storage::disk('public')->exists($settings->company_logo)) {
                    Storage::disk('public')->delete($settings->company_logo);
                }

                $logoPath = $request->file('company_logo')->store('logos', 'public');
                $data['company_logo'] = $logoPath;
            }

            if ($settings->exists) {
                $settings->update($data);
            } else {
                CompanySetting::create($data);
            }

            DB::commit();

            return redirect()->route('settings.index')
                ->with('success', 'Configuración actualizada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al actualizar la configuración: ' . $e->getMessage());
        }
    }

    public function company()
    {
        $settings = CompanySetting::first() ?? new CompanySetting();
        return view('settings.company', compact('settings'));
    }

    public function updateCompany(Request $request)
    {
        return $this->update($request);
    }

    public function system()
    {
        $settings = CompanySetting::first() ?? new CompanySetting();
        return view('settings.system', compact('settings'));
    }

    public function updateSystem(Request $request)
    {
        $request->validate([
            'currency' => 'required|string|max:10',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'low_stock_threshold' => 'required|integer|min:0',
            'invoice_prefix' => 'required|string|max:10',
            'invoice_footer' => 'nullable|string|max:1000',
            'backup_frequency' => 'required|in:daily,weekly,monthly',
            'notification_email' => 'required|email',
            'enable_notifications' => 'boolean',
            'enable_low_stock_alerts' => 'boolean',
            'enable_expiry_alerts' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $settings = CompanySetting::first() ?? new CompanySetting();
            
            if ($settings->exists) {
                $settings->update($request->all());
            } else {
                CompanySetting::create($request->all());
            }

            DB::commit();

            return redirect()->route('settings.system')
                ->with('success', 'Configuración del sistema actualizada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Error al actualizar la configuración: ' . $e->getMessage());
        }
    }
}