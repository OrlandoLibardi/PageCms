<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use OrlandoLibardi\OlCms\AdminCms\app\Admin;

class AdminPagesCmsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {       
        
        Admin::create([
            'name' => 'Dashboard',
            'route' => 'index.index',
            'icon' => 'fa fa-home',
            'parent_id' => 0,
            'minimun_can' => 'list',
            'order_at' => 0
        ]);
       
    }
}
