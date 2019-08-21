<?php

namespace OrlandoLibardi\PageCms\app;
use File;
use OrlandoLibardi\PageCms\app\Page;

class ServicePage
{   
    /**
     * Lê o arquivo de configuração e retorna o caminho para pasta paginas
     * @return Config\Pages\page_path
     */
    public static function getPagePath(){
        return config('pages.page_path');
    }
    /**
     * Lê o arquivo de configuração e retorna o caminho para temporario pasta paginas
     * @return Config\Pages\page_path_temp
     */
    public static function getPagePathTemp(){
        return config('pages.page_path_temp');
    }
    /**
     * Lê o arquivo de configuração e retorna a extensão de arquivo para páginas
     * @return Config\Pages\page_extension
     */
    public static function getPageExtension(){
        return config('pages.page_extension');
    }
    /**
    * Retorna o caminho para o arquivo de rotas dinâmicas de páginas
    * @return string 
    */
    public static function getRouteFileName(){
        return __DIR__ . '/../routes/web-dynamic.php';
    }
    /**
     * Abre o arquivo de rotas e retorna ele mesmo
     * @return string
     */
    public static function openFileRoute(){
        return File::get( self::getRouteFileName() );
    }
    /**
     * Salva o arquivo na pasta 
     * @return void
     */
    public static function saveFileRoute( $content ){
        return File::put( self::getRouteFileName(), $content );
    }
    /**
     * String de modelo para Rotas
     * @return string
     */
    public static function modelRoute( $alias ){
        return 'Route::get("' . $alias . '/{extra?}", function($extra=null){ return view("website.'.$alias.'", compact("extra")); })->where("extra", "([A-Za-z0-9\-\/]+)")->middleware("web");';
    } 

    /**
     * Lê os arquivos disponíveis para serem usados como modelo
     * @return array 
    */
    public static function getTemplates()
    {
        $files = File::files(self::getPagePath());
        $return = [];
        foreach($files as $f){
            $fp = pathinfo($f);
            if(substr_count($fp['filename'], ".blade") > 0 ){
                $name = str_replace(".blade", "", $fp['filename']);
                $return[$name] = $name;
            }
        }
        return $return;
    }
    /**
     * Prepara um arquivo modelo para edição
     * @return $file
     */
    public static function prepareFile( $file )
    {
        $original_file     = $file;
        $new_file_name     = sha1(time());
        //ler o arquivo original
        $open  = File::get(self::getPagePath() . $original_file . self::getPageExtension());
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
        $patterns[8] = '/<(picture\s((.|\n)*?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/picture>/i';
        
        //valores a serem substituídos
        $replacements[0] = '<span class="object-editable" data-editable="true" data-type="content" data-id="0"><div data-edit="true" $2 $3>$5</div></span>';
        $replacements[1] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h1 data-edit="true" $2 $4>$6</h1></span>';
        $replacements[2] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h2 data-edit="true" $2 $4>$6</h2></span>';
        $replacements[3] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h3 data-edit="true" $2 $4>$6</h3></span>';
        $replacements[4] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h4 data-edit="true" $2 $4>$6</h4></span>';
        $replacements[5] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h5 data-edit="true" $2 $4>$6</h5></span>';
        $replacements[6] = '<span class="object-editable" data-editable="true" data-type="title" data-id="0"><h6 data-edit="true" $2 $4>$6</h6></span>';
        $replacements[7] = '<span class="object-editable" data-editable="true" data-type="image" data-id="0"><img data-edit="true" $2 $3 /></span>';
        $replacements[8] = '<span class="object-editable" data-editable="true" data-type="picture" data-id="0"><picture data-edit="true" $2> $6 </picture></span>';
        
        //substituição dos valores
        $dados = preg_replace($patterns, $replacements, $open, '-1', $count);
        
        
        //aplicavel somente para links com imagens
        $dados = preg_replace_callback(
                '/<(a\s((.+?)?)data-edit="true")((.+?)*?)>((.|\n)*?)<\/a>/i',
                function($m) use ($count){
                    if(substr_count($m[6], '<picture') > 0 ){
                        $obj = '<span class="object-editable" data-editable="true" data-type="picture" data-id="0">';
                        $obj .= '<a '.$m[3].' '.$m[4].' >';
                        $obj .= $m[6];
                        $obj .= '</a>';
                        $obj .= '</span>';
                        return $obj;
                    }
                    else if(substr_count($m[6], '<img') > 0 ){
                        $obj = '<span class="object-editable"  data-editable="true" data-type="image" data-id="0">';
                        $obj .= '<a '.$m[3].' '.$m[4].' >';
                        $obj .= $m[6];
                        $obj .= '</a>';
                        $obj .= '</span>';
                        return $obj;
                    }
                }, $dados);
        //gerando identificadores para os blocos no template
        
        for($i=1; $i <= $count; $i++){
            $dados = preg_replace('/data-id="0"/', 'data-id="'.$i.'"', $dados, 1);
        }      
        //adicionando a dependencia javascript ao modelo editável
        $javascript = '<script src="'.asset('assets/theme-admin/js/plugins/OLForm/OLTemplates.v2.js').'"></script></body>';
        $dados      = str_replace("</body>", $javascript, $dados);
        
        $css        = '<link rel="stylesheet" type="text/css" media="screen" href="'.asset('assets/theme-admin/css/plugins/OLForm/OLTemplates.css').'"></head>';
        
        $dados      = str_replace("</head>", $css, $dados);

        
  
        //salvar o modelo na pasta temporaria
        File::put(self::getPagePathTemp() . $new_file_name . self::getPageExtension(), $dados);
        
        //retornar o nome temporario do arquivo
        return $new_file_name;

    }

    /**
    * Confirma se o arquivo existe caso existir gera o arquivo editavel e responde
    *
    * @param  $template
    * @return string $url
    */
    public static function postCreator($template)
    {
        $file = $template;        
        if(!File::isFile(self::getPagePath() . $file . self::getPageExtension())){
            return false;
        }
        return self::prepareFile( $file );       
    }
    /**
    * Atualiza o template removendo os elementos removidos pelo usuário
    * @param string $file, $content, $titulo, $atualAlias = false
    * @return boolen
    */
    public static function destroyElementsTemplate($file, $content, $titulo, $atualAlias = false)
    {
        $content = json_decode($content);
        $ids = self::getIds($content);
        $contents = self::getReplaces($content);        
        $alias = ($atualAlias!=false) ? $atualAlias : self::checkAlias(str_slug($titulo, '-'), 0);
        //Abrir o arquivo temporario
        $open = File::get(self::getPagePathTemp() . $file . self::getPageExtension());
        //substituir os blocos editáveis para o padrão
        $newString = preg_replace_callback('/<(span\s(.+?)data-id="([0-9])")((.+?)*?)>((.|\n)*?)<\/span>/i',
            function ($matches) use ($ids, $contents){
                if(!in_array($matches[3], $ids)){
                    return preg_replace('/<(span\s(.+?)data-id="'.$matches[3].'")((.+?)*?)>((.|\n)*?)<\/span>/', '', $matches[0], 1);                    
                }else{
                   // return str_replace($matches[1], $contents[$matches[3]],  $matches[1]);
                   return str_replace($matches[1], $contents[$matches[3]],  $matches[1]);
                }
            }, $open );
            
        //remove a dependência javascript do template
        $javascript = '<script src="'.asset('assets/theme-admin/js/plugins/OLForm/OLTemplates.v2.js').'"></script>';
        $css        = '<link rel="stylesheet" type="text/css" media="screen" href="'.asset('assets/theme-admin/css/plugins/OLForm/OLTemplates.css').'">';
        $newString  = str_replace($css, "", $newString);
        $newString  = str_replace($javascript, "", $newString);
        //salva o novo arquivo na pasta final
        File::put(self::getPagePath() . $alias . self::getPageExtension(), $newString);   
        //remover o arquivo da pasta temporaria
        File::delete(self::getPagePathTemp() . $file . self::getPageExtension());
        return true;
    }
    /**
     * Verifica se existe um registro com mesmo slug caso sim adiciona um indice ao final e verifica de novo
     * @param $alias, $count
     * @return $alias
     */
    public static function checkAlias($alias, $count=0)
    {
        $alias = ($count > 0) ? $alias.'-'.$count : $alias;
        $page = Page::where('alias', $alias)->get();        
        if(count($page) > 0)
            return self::checkAlias($alias, $count+1);

        return $alias;
    }
    /**
     * Cria um vetor com os itens a serem tratados
     * @param array $contents
     * @return array $return 
     */
     public static function getReplaces($contents)
     {        
        $return = [];
        foreach ($contents as $value) {
            $return[$value->id] = $value->content;
        }
        return  $return;
     } 
     /**
      * Cria um vetor com os indices a serem tratados
      * @param array $contents
      * @return array $return 
      */
     public static function getIds($contents)
     {        
        $return = [];
        foreach ($contents as $value) 
        {
            $return[] = $value->id;
        }
        return  $return;
     } 
     /**
      * Cria a rota da página
      * @return void
      */
     public static function createRoutePage($alias)
     {
        $obj = self::modelRoute($alias);
        
        $contentes = self::openFileRoute();

        if ( substr_count( $contentes, $obj ) == 0 ) {
            $contentes .= "\n" . $obj;
            self::saveFileRoute( $contentes );
        }   
        return true;     
     }  
     /**
      * Atualiza o status da página
      * @param int $id, int $status 
      * @return void
      */
    public static function updateStatus($id, $status)
    {
        $new_status = ( $status == 0 ) ? 1 : 0 ;
        Page::find($id)
            ->update([
                'status' => $new_status
            ]);
        return true;    
    }  
    /**
     * Deleta uma página
     * @param array $ids
     */
    public static function deletePage($ids){
        $ids = json_decode($ids);
        foreach($ids as $id){
            if(is_numeric($id)){
                $page =  Page::find($id)->delete();
            }
        }
    } 
    /**
     * Apaga um arquivo de template
     * @return void
     */
    public static function deleteTemplate($alias){
       File::delete(self::getPagePath() . $alias . self::getPageExtension());
    }
    /**
     * Apaga uma rota de página
     * @param string $alias
     */
    public static function deleteRoute($alias){

        $obj = self::modelRoute($alias);
        
        $contentes = self::openFileRoute();

        if ( substr_count( $contentes, $obj ) > 0 ) {
            $contentes = str_replace($obj, "", $contentes);
            self::saveFileRoute( $contentes );
        }        
    }


}