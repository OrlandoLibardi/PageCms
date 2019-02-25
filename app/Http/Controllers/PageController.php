<?php

namespace OrlandoLibardi\PageCms\app\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use OrlandoLibardi\PageCms\app\Page;
use OrlandoLibardi\PageCms\app\ServicePage;
use OrlandoLibardi\PageCms\app\Http\Requests\PageRequest;
use OrlandoLibardi\PageCms\app\Http\Requests\PageStatusRequest;
use OrlandoLibardi\PageCms\app\Http\Requests\PageDeleteRequest;

class PageController extends Controller
{   

    public function __construct()
    {
        $this->middleware('permission:list');
        $this->middleware('permission:create', ['only' => ['create', 'store', 'postCreator']]);
        $this->middleware('permission:edit', ['only' => ['edit', 'update', 'status']]);
        $this->middleware('permission:delete', ['only' => ['destroy']]);
    }

    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $files = ServicePage::getTemplates();
        $data  = Page::orderBy('name','ASC')->paginate(10);
        return view('admin.pages.index', compact('files', 'data'));
    }
    /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function create(Request $request) 
    {
        $file_route = $request->file_route;
        return view('admin.pages.create', compact('file_route') );
    }
    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(PageRequest $request) 
    {
        ServicePage::destroyElementsTemplate($request->content, $request->contents, $request->name);
        $page = Page::create( $request->all() );
        $edit_route = route('pages.edit', [ 'id' => $page->id ]);
        return response()->json(array( 'message' => 'Criado com sucesso.', 'status'  =>  'success', 'data' => ['edit_route' => $edit_route] ), 201);  
    }
    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id) 
    {
        $page = Page::find($id);
        $view = "website." . $page->alias;
        return view($view);
    }
    
    /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function edit($id) 
    {
        $page = Page::find($id);
        $file_route = ServicePage::prepareFile( $page->alias );
        return view('admin.pages.edit', compact('page', 'file_route') );
    }

    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function update(PageRequest $request, $id) 
    {       
        ServicePage::destroyElementsTemplate($request->content, $request->contents, $request->name, $request->alias);
        Page::find($id)
            ->update( 
                $request->all() 
            );        
        $edit_route = route('pages.edit', [ 'id' => $id ]);  
        return response()->json(array( 'message' => 'Editado com sucesso.', 'status'  =>  'success', 'data' => ['edit_route' => $edit_route] ), 201);
    }
    
    /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function destroy(PageDeleteRequest $request) 
    {
        ServicePage::deletePage($request->input('id')); 
        return response()->json(array( 'message' => 'Removidos com sucesso!', 'status'  =>  'success'), 201);
    }  
    /**
    * Atauliza o status de exibição da página
    * @param  \Illuminate\Http\Request  $request
    * @return
    */
    public function status(PageStatusRequest $request)
    {
        ServicePage::updateStatus($request->id, $request->status);
        return response()->json(array( 'message' => 'Alterado com sucesso!', 'status'  =>  'success'), 201);
    }
    /**
    * Display the specified resource.
    *
    * @param  int  $template
    * @return \Illuminate\Http\Response
    */
    public function showTemplate($template) 
    {
        return view('website.temp.'.$template);
    }  
   /**
    * Confirma se o arquivo existe caso existir gera o arquivo editavel e responde com uma rota para visualização
    *
    * @param  \Illuminate\Http\Request  $request
    * @return string $url
    */
    public function postCreator(Request $request)
    {
        $file_route = ServicePage::prepareFile( $request->template );
        return response()->json(
                array('message' => 'Arquivo criado com sucesso!',
                      'status' => 'success',
                      'data' => ['url' => $file_route]
                  ), 201 );
    }   
    
}
