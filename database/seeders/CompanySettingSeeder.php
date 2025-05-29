<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompanySetting;

class CompanySettingSeeder extends Seeder
{
    public function run(): void
    {
        CompanySetting::firstOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Frutería El Jardín',
                'business_name' => 'El Jardín S.R.L.',
                'tax_id' => '20-12345678-9',
                'address' => 'Av. Principal 123, Barrio Centro',
                'city' => 'Buenos Aires',
                'state' => 'CABA',
                'postal_code' => '1000',
                'phone' => '+54 11 1234-5678',
                'email' => 'info@fruteria.com',
                'website' => 'www.fruteria.com',
                'tax_condition' => 'monotributo',
                'default_tax_rate' => 21.00,
                'activities_start_date' => '2020-01-01',
                'primary_color' => '#66BB6A',
                'secondary_color' => '#FFEB3B',
                'theme_mode' => 'light',
                'currency' => 'ARS',
                'currency_symbol' => '$',
                'decimal_places' => 2,
                'invoice_prefix' => 'FAC',
                'next_invoice_number' => 1,
                'receipt_prefix' => 'TKT',
                'next_receipt_number' => 1,
                'auto_update_stock' => true,
                'allow_negative_stock' => false,
                'track_expiry_dates' => true,
                'low_stock_alert_days' => 7,
                'auto_backup' => true,
                'backup_frequency' => 'daily',
            ]
        );
    }
}