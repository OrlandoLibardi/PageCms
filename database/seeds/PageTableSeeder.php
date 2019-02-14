<?php

use Illuminate\Database\Seeder;
use OrlandoLibardi\PageCms\app\Page;

class PageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        Page::create([
            'name' => 'Home', 
            'alias' => 'home', 
            'content' => 'home', 
            'status' => 1, 
            'meta_title' => 'Página de demonstração', 
            'meta_description' => 'Página de demonstração', 
            'meta_image' => ''
        ]);
    }
}
