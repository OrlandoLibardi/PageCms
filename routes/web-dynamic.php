<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Estas rotas são administradas pelos eventos CreateRoutePage, UpdateRoutePage e DeleteRoutePage
| 
*/


Route::get("primeira-pagina/{extra?}", function(){ return view("website.primeira-pagina"); })->where("extra", "([A-Za-z0-9\-\/]+)");