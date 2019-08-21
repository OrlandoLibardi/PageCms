<?php

namespace OrlandoLibardi\PageCms\app\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use OrlandoLibardi\PageCms\app\Page;
use OrlandoLibardi\PageCms\app\ServicePage;

class PageShowController extends Controller
{   
    /**
    * Display the specified resource.
    *
    * @param  string alias, string extra
    * @return \Illuminate\Http\Response
    */
    public function show(Request $request) 
    {
        $extra      = $request->extra;
        $alias      = $this->getAlias($request->path(), $extra);
        $page       = Page::alias($alias)->first();
        $template   = "website." . $alias;        
        return view($template, compact("extra", "page"));
    }

    public function getAlias($path, $alias=false){
        $path = str_replace($alias, "", $path);
        $path = str_replace("/", "", $path);
        return $path;
    }
    
       
}

?>