<?php

namespace OrlandoLibardi\OlCms\AdminCms\app\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AdminCmsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        /**
         * Rotas
         */
        Route::namespace('OrlandoLibardi\OlCms\AdminCms\app\Http\Controllers\Admin')
        ->middleware(['web', 'auth'])
        ->prefix('admin')
        ->group(__DIR__. '/../../routes/web.php');
        /**
         * Publishes
         */
        $this->publishes([
            __DIR__.'/../../resources/lang'   => resource_path('/lang'),
            __DIR__.'/../../resources/views'   => resource_path('/views'),
            __DIR__.'/../../resources/emails'   => resource_path('/views/emails'),
            __DIR__.'/../../public' => public_path('/'),
            __DIR__.'/../../database/migrations/' => database_path('migrations'),
            __DIR__.'/../../database/seeds/' => database_path('seeds'),
        ], 'config');
        
        
    }

}