<?php

namespace OrlandoLibardi\PageCms\app\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use File;
use OrlandoLibardi\PageCms\app\Page;

use OrlandoLibardi\PageCms\app\ServicePage as ServicePage;

use App\Events\CreateOrUpdatePage;



class PageControllerOLD extends Controller
{
    public $page_path;
    public $page_path_temp;
    public $page_extension;

    public function __construct(){

        $this->page_path = config('pages.page_path');
        $this->page_path_temp = config('pages.page_path_temp');
        $this->page_extension = config('pages.page_extension');

        $this->middleware('permission:list');
        $this->middleware('permission:create', ['only' => ['create', 'store', 'postCreator', 'destroyElementsTemplate', 'prepareFile', 'getTemplates']]);
        $this->middleware('permission:edit', ['only' => ['edit', 'update', 'status']]);
        $this->middleware('permission:delete', ['only' => ['destroy']]);
    }

    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index(){
        //alterar isso
        $files = array_pluck($this->getTemplates(), 'file', 'file');
        $data  = Page::orderBy('name','ASC')->paginate(10);
        return view('admin.pages.index', compact('files', 'data'));
    }
    /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function create(Request $request) {
        $file_route = $request->file_route;
        return view('admin.pages.create', compact('file_route') );
    }
    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(Request $request) {
        //regras de validação de dados
        $validator = validator($request->all(),
        [ 'titulo' => 'required',
          'status' => 'required|numeric',
          'meta_title' => 'required|string|max:90',
          'meta_description' => 'required|string|max:180',
          'contents' => 'required',
          'template'     => 'required']
       );
       //exibe erros se houver erros na validação dos dados
        if($validator->fails()) {
            return response()
                  ->json(array(
                      'message' => 'Por favor, preencha todos os campos obrigatórios.',
                      'status'  =>  'error',
                      'errors'   =>  $validator->errors()->all()
                  ), 401);
        }
        //gerar um alias unico
        $alias = $this->findSlug(str_slug($request->titulo, '-'), 0);
        //Manipular os contents e seus ids
        $contents = json_decode($request->contents);
        $ids = [];
        $replaces = [];
        foreach ($contents as $value) {
                $ids[] = $value->id;
                $replaces[$value->id] = $value->content;
        }
        //Eliminar os ids não usados e retornar o template ao estado original
        if(!$this->destroyElementsTemplate($request->template, $ids, $replaces, $alias)){
            return response()
                  ->json(array(
                      'message' => 'Erro ao manipular os arquivos!',
                      'status'  =>  'error',
                      'errors'   => []
                  ), 401);
        }

        //Criar a página
        $page = Page::create([ 'name' => $request->titulo,
                       'alias' => $alias,
                       'content' => $request->template,
                       'status' => $request->status,
                       'meta_title' => $request->meta_title,
                       'meta_description' => $request->meta_description,
                       'meta_image' => "" ]);
        //Evento
        event(new CreateOrUpdatePage($page));               
       //Gerar a rota de edição
      $edit_route = route('pages.edit', [ 'id' => $page->id ]);
      //Mensagem de sucesso com a rota de edição
      return response()->json(array( 'message' => 'Criado com sucesso.', 'status'  =>  'success', 'data' => ['edit_route' => $edit_route] ), 201);

    }
    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id) {
        $page = Page::find($id);
        //$view = "website.templates.{$page->alias}";
        $view = "website.{$page->alias}";
        return view($view);

    }
    /**
    * Display the specified resource.
    *
    * @param  int  $template
    * @return \Illuminate\Http\Response
    */
    public function showTemplate($template) {


        return view('website.temp.'.$template);

    }
    /**
    * Show the form for editing the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function edit($id) {
        //dados da página
        $page = Page::find($id);
        $file = $page->alias;
        //checar se o arquivos existe
        if(!File::isFile( $this->page_path . $file.$this->page_extension )){
            return response()->json(array( 'message' => 'O arquivo selecionado não existe!.', 'status'  =>  'error',  'errors'   =>  [] ), 422);
        }
        //montar o arquivo editavel e criar a rota
        $file_route = $this->prepareFile( $file );
        //retornar a rota
        return view('admin.pages.edit', compact('page', 'file_route') );
    }

    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, $id) {
        //regras de validação
        $validator = validator($request->all(),
        [ 'titulo' => 'required',
          'status' => 'required|numeric',
          'meta_title' => 'required|string|max:90',
          'meta_description' => 'required|string|max:180',
          'contents' => 'required',
          'template'     => 'required']
      );
      //exibe erro se houver erros na validação
        if($validator->fails()) {
            return response()
                  ->json(array(
                      'message' => 'Por favor, preencha todos os campos obrigatórios.',
                      'status'  =>  'error',
                      'errors'   =>  $validator->errors()->all()
                  ), 401);
        }
        //Trabalhar os contents e os ids
        $contents = json_decode($request->contents);
        $ids = [];
        $replaces = [];
        foreach ($contents as $value) {
                $ids[] = $value->id;
                $replaces[$value->id] = $value->content;
        }
        //destruir os elementos no template removidos pelo usuário, caso não seja possível exibir erro
        if(!$this->destroyElementsTemplate($request->template, $ids, $replaces, $request->alias)){
            return response()
                  ->json(array(
                      'message' => 'Erro ao manipular os arquivos!',
                      'status'  =>  'error',
                      'errors'   => []
                  ), 401);
        }

        //Gravar os dados da página no banco de dados
        Page::find($id)->update([ 'name' => $request->titulo,
                                   'content' => $request->template,
                                   'status' => $request->status,
                                   'meta_title' => $request->meta_title,
                                   'meta_description' => $request->meta_description,
                                   'meta_image' => "" ]);
       //criar a rota para edição da página
       $edit_route = route('pages.edit', [ 'id' => $id ]);
       //exibir a resposta passando o valor da rota para edição
       return response()->json(array( 'message' => 'Editado com sucesso.', 'status'  =>  'success', 'data' => ['edit_route' => $edit_route] ), 201);

    }
    /**
    * Atauliza o status de exibição da página
    * @param  \Illuminate\Http\Request  $request
    * @return
    */
    public function status(Request $request){

        $validator = validator($request->all(),[
              'id' => 'required|exists:pages,id',
              'status' => 'required|numeric'
              ] );

        if($validator->fails())
            return response()->json(array( 'message' => 'Os dados fornecidos são inválidos.', 'status'  =>  'error',  'errors'   =>  $validator->errors()->all() ), 422);

        $new_status = ( $request->status == 0 ) ? 1 : 0 ;

        Page::find($request->id)->update(['status' => $new_status]);

        return response()->json(array( 'message' => 'Alterado com sucesso!', 'status'  =>  'success'), 201);

    }
    /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function destroy(Request $request) {

        $validator = validator($request->all(), [ 'id' => 'required'] );
        if($validator->fails())
            return response()->json(
                array( 'message' => 'Os dados fornecidos são inválidos.',
                        'status'  =>  'error',
                        'errors'   =>  $validator->errors()->all()
            ), 422);

        $ids = json_decode($request->input('id'));

        foreach($ids as $id){
            if(is_numeric($id)){
                $page =  Page::find($id);
                $alias = $page->alias;
                File::delete($this->page_path_temp . $alias . $this->page_extension);
                $page->delete();
            }
        }

        return response()->json(array( 'message' => 'Removidos com sucesso!', 'status'  =>  'success'), 201);
    }
    /**
    * Verifica se o slug encontra-se disponivel para uso, caso negativo acrescenta +1 e procura novamente
    * @param  string $slug
    * @param  int $count
    * @return string $slug
    */
    public function findSlug($slug, $count){

        $slug = ($count > 0) ? $slug.'-'.$count : $slug;

        $page = Page::where('alias', $slug)->get();

        if(count($page) > 0)
            return $this->findSlug($slug, $count+1);

        return $slug;
    }
    /**
    * Atualiza o template removendo os elementos removidos pelo usuário
    * @param string $file, object $ids, $contents
    * @return boolen
    */
    public function destroyElementsTemplate($file, $ids, $contents, $alias){
        //Abrir o arquivo temporario
        $open = File::get($this->page_path_temp.$file.$this->page_extension);
        //substituir os blocos editáveis para o padrão
        $newString = preg_replace_callback('/<(span\s(.+?)data-id="([0-9])")((.+?)*?)>((.|\n)*?)<\/span>/i',
            function ($matches) use ($ids, $contents){
                if(!in_array($matches[3], $ids)){
                    return preg_replace('/<(span\s(.+?)data-id="'.$matches[3].'")((.+?)*?)>((.|\n)*?)<\/span>/', '', $matches[0], 1);
                }else{
                    return str_replace($matches[1], $contents[$matches[3]],  $matches[1]);
                }
            }, $open );
        //remover a dependencia javascript do template
        $javascript = '<script src="'.asset('assets/theme-admin/js/plugins/OLForm/OLTemplates.js').'"></script>';
        $newString  = str_replace($javascript, "", $newString);
        //salvar o novo arquivo na pasta final
        File::put($this->page_path . $alias . $this->page_extension, $newString);
        //remover o arquivo na pasta temporaria
        File::delete($this->page_path_temp . $file . $this->page_extension);
        return true;

    }
    /**
    * Confirma se o arquivo existe caso existir gera o arquivo editavel e responde com uma rota para visualização
    *
    * @param  \Illuminate\Http\Request  $request
    * @return string $url
    */
    public function postCreator(Request $request){

        $file = $request->template;
        //confirmar se o arquivo existe
        if(!File::isFile($this->page_path.$file.$this->page_extension)){
            return response()->json(
                array( 'message' => 'O arquivo selecionado não existe!.',
                        'status'  =>  'error',
                        'errors'   =>  []
                    ), 422);
        }
        //preparar o arquivo para edição
        $file_route = $this->prepareFile( $file );
        //retornar mensagem com a rota do arquivo para edição
        return response()->json(
                array('message' => 'Arquivo criado com sucesso!',
                      'status' => 'success',
                      'data' => ['url' => $file_route]
                  ), 201 );
    }
    /**
    * Prepara o content para ser editado via interface humana do outro lado da view
    *
    * @param string $file, $page_path, $page_extension
    * @return string $new_file_name
    */
    public function prepareFile( $file ){

        $original_file     = $file;
        $new_file_name     = sha1(time());
        //ler o arquivo original
        $open  = File::get($this->page_path . $original_file . $this->page_extension);
        $dados = [];
        $patterns = [];
        $replacements = [];
        $count = 0;
        //valores a serem enontrados
        $patterns[0] = '/<(div(.+?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/div>/i';
        $patterns[1] = '/<(h1\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h1>/i';
        $patterns[2] = '/<(h2\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h2>/i';
        $patterns[3] = '/<(h3\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h3>/i';
        $patterns[4] = '/<(h4\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h4>/i';
        $patterns[5] = '/<(h5\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h5>/i';
        $patterns[6] = '/<(h6\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/h6>/i';
        $patterns[7] = '/<(img(.+?)data-edit="true")((.+?)*?)>/i';
        //valores a serem substituídos
        $replacements[0] = '<span data-editable="true" data-type="content" data-id="0"><div $2 $3>$5</div></span>';
        $replacements[1] = '<span data-editable="true" data-type="title" data-id="0"><h1 $2 $4>$6</h1></span>';
        $replacements[2] = '<span data-editable="true" data-type="title" data-id="0"><h2 $2 $4>$6</h2></span>';
        $replacements[3] = '<span data-editable="true" data-type="title" data-id="0"><h3 $2 $4>$6</h3></span>';
        $replacements[4] = '<span data-editable="true" data-type="title" data-id="0"><h4 $2 $4>$6</h4></span>';
        $replacements[5] = '<span data-editable="true" data-type="title" data-id="0"><h5 $2 $4>$6</h5></span>';
        $replacements[6] = '<span data-editable="true" data-type="title" data-id="0"><h6 $2 $4>$6</h6></span>';
        $replacements[7] = '<span data-editable="true" data-type="image" data-id="0"><img $2 $3 /></span>';
        //substituição dos valores
        $dados = preg_replace($patterns, $replacements, $open, '-1', $count);
        //gerando identificadores para os blocos no template
        for($i=1; $i <= $count; $i++){
            $dados = preg_replace('/data-id="0"/', 'data-id="'.$i.'"', $dados, 1);
        }
        //aplicavel somente para links com imagens
        $dados = preg_replace_callback(
                '/<(a\s((.+?)?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/a>/i',
                function($m) use ($count){
                    if(substr_count($m[6], '<img') > 0 ){
                        $obj = '<span data-editable="true" data-type="image" data-id="'.($count+1).'">';
                        $obj .= '<a '.$m[3].' '.$m[4].' />';
                        $obj .= $m[6];
                        $obj .= '</a>';
                        $obj .= '</span>';
                        return $obj;
                    }
                }, $dados);
        //adicionando a dependencia javascript ao modelo editável
        $javascript = '<script src="'.asset('assets/theme-admin/js/plugins/OLForm/OLTemplates.js').'"></script></body>';
        $dados      = str_replace("</body>", $javascript, $dados);
        //salvar o modelo na pasta temporaria
        File::put($this->page_path_temp . $new_file_name . $this->page_extension, $dados);
        //retornar o nome temporario do arquivo
        return $new_file_name;

    }
    /**
    *
    *
    */
    function getTemplates(){
        $files = File::files($this->page_path);
        $return = [];
        foreach($files as $f){
            $fp = pathinfo($f);
            if(substr_count($fp['filename'], ".blade") > 0 ){
                $file = [];
                $name = str_replace(".blade", "", $fp['filename']);
                $return[] = $file;
            }
        }
        return array_pluck($return, 'file', 'file');
    }
    
}
