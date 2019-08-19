<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Estas rotas são administradas pelos eventos CreateRoutePage, UpdateRoutePage e DeleteRoutePage
| 
*/



Route::get("contato/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("portfolio/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");


Route::get("home-es/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("camarote-arena-es/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-modulares-es/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-de-conferencia-arena-es/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("camarote-arena-en/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-modulares-en/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-de-conferencia-arena-en/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("home-en/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("camarote-arena/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-de-conferencia-arena/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("salas-modulares/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");

Route::get("home/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")
->where("extra", "([A-Za-z0-9\-\/]+)")
->middleware("web");
