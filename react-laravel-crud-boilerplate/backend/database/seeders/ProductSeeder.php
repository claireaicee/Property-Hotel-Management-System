<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::insert([
            ['name' => 'Wireless Mouse', 'sku' => 'ACC-001', 'category' => 'Accessories', 'quantity' => 24, 'price' => 599.00, 'description' => 'Ergonomic wireless mouse', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'USB-C Hub', 'sku' => 'ACC-002', 'category' => 'Accessories', 'quantity' => 12, 'price' => 1299.00, 'description' => 'Multi-port USB-C adapter', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Notebook', 'sku' => 'STN-001', 'category' => 'Stationery', 'quantity' => 4, 'price' => 45.00, 'description' => 'A5 ruled notebook', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
