<?php

namespace OrlandoLibardi\PageCms\app;
use File;
use Log;
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
        
        $route_  = 'Route::get("' . $alias . '/{extra?}", "OrlandoLibardi\PageCms\app\Http\Controllers\PageShowController@show")' . "\n";
        $route_ .= '->where("extra", "([A-Za-z0-9\-\/]+)")' . "\n";
        $route_ .= '->middleware("web");' . "\n";
        return $route_;
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
        //lê o arquivo original e armazenar em $open
        $open  = File::get(self::getPagePath() . $original_file . self::getPageExtension());
        //alterar a body para adiiconar a classe de loading
        $body_find    = '/<(body(\s(.|\n)*?)class="(.+?)"((.)*?)>)/i';
        $body_replace = '<body $2 class="objects_load $4" $5>';
        $dados = preg_replace($body_find, $body_replace, $open);
        //Adicionando as dependência javascript ao arquivo
        $append_footer  = '<script src="'.asset('assets/theme-admin/js/plugins/OLTemplates/OLTemplates.v2.js').'"></script>' . "\n";
        $append_footer .= '<script src="'.asset('assets/theme-admin/js/plugins/OLTemplates/OLTemplatesObjects.v2.js').'"></script>' . "\n";
        $append_footer .= '<script>$(document).ready(function(e){$("body").OLTemplatesObjects();});</script>' . "\n";
        $append_footer .= '</body>' . "\n";
        $append_header  = '<link rel="stylesheet" type="text/css" media="screen" href="'.asset('assets/theme-admin/js/plugins/OLTemplates/OLTemplates.css').'">' . "\n";
        $append_header .= '</head>' . "\n";
        $dados       = str_replace("</body>", $append_footer, $dados);        
        $dados       = str_replace("</head>", $append_header, $dados);
        $dados       = str_replace("<body>", '<body class="objects_load"', $dados);
        //Salvar o arquivo como um modelo editável na pasta temp
        File::put(self::getPagePathTemp() . $new_file_name . self::getPageExtension(), $dados);
        //Retornar o nome temporario do arquivo
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