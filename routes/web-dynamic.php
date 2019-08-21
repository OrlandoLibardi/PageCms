<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Estas rotas são administradas pelos eventos CreateRoutePage, UpdateRoutePage e DeleteRoutePage
| 
*/


Route::get("primeira-pagina/{extra?}", function(){ return view("website.primeira-pagina"); })->middleware("web");
Route::get("home/{extra?}", function($extra=null){ return view("website.home", compact("extra")); })->where("extra", "([A-Za-z0-9\-\/]+)")->middleware("web");
Route::get("contato/{extra?}", function($extra=null){ return view("website.contato", compact("extra")); })->where("extra", "([A-Za-z0-9\-\/]+)")->middleware("web");
Route::get("portfolio/{extra?}", function($extra=null){ return view("website.portfolio", compact("extra")); })->where("extra", "([A-Za-z0-9\-\/]+)")->middleware("web");