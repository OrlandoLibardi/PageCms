<?php

namespace OrlandoLibardi\PageCms\app\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class OlCmsPageServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //Rotas para controllador pages
        Route::namespace('OrlandoLibardi\PageCms\app\Http\Controllers')
        ->middleware(['web', 'auth'])
        ->prefix('admin')
        ->group(__DIR__. '/../../routes/web.php');


        //registrar as views
        $this->loadViewsFrom( __DIR__.'/../../resources/views/pages/', 'viewPage');
        //publicar os arquivos
        $this->publishes([
            __DIR__.'/../../resources/views/admin/' => resource_path('views/admin/'),
            __DIR__.'/../../resources/views/website/' => resource_path('views/webiste/'),            
            __DIR__.'/../../database/migrations/' => database_path('migrations'),
            __DIR__.'/../../database/seeds/' => database_path('seeds'),
            __DIR__.'/../../config/pages.php' => config_path('pages.php'),
        ],'adminPage');

        
        
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        
    }
}