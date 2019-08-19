var imageAction = false; 
    /* Countables */
    $("input[name=meta_title_temp]").OLInputCount({ 'max' : 90, 'inside' : '#label_meta_title'});
    $("input[name=meta_description_temp]").OLInputCount({ 'max' : 160, 'inside' : '#label_meta_description'});
    /* Dates */
    $("input[name=publish_at_temp]").bind('keypress', mask.birth);
    $("input[name=unpublished_at_temp]").bind('keypress', mask.birth);
    /* Formulário */
    $("#form-blog").OLForm({ btn: true, listErrorPosition: 'after', listErrorPositionBlock: '.page-heading', urlRetun: $("input[name=url_return]").val() });
    /* Textarea */
    $content = $('#content');
    $content.summernote({ 
        lang: 'pt-BR', 
        disableDragAndDrop: true,
        toolbar: [
            ['misc', ['undo', 'redo', 'codeview']],
            ['style', [ 'style', 'color', 'fontsize', 'bold', 'italic', 'underline', 'link', 'clear']], 
            ['para', ['table', 'paragraph', 'video', 'olImagePlugin']],    
        ],
        olImagePlugin: {
            icon: '<i class="fa fa-file-image-o"/>',
            tooltip: 'Example Plugin Tooltip',
            chagearea : changeAreaImage
        }
    });
    /*Images*/
    $("body").OLFiles({
        actionListFolders: $("input[name=url_files_get_all]").val(),
        actionCreateFolder: $("input[name=url_create_folder]").val(),
        actionOpenFile: showImage,
        actionSendFile: $("input[name=url_send_files]").val(),
        initialFolder: "public/"
    });
    /*Open images list */
    $(document).on("click", '.img-fake', function () {
        changeAreaImage('principal');
    });
    //Remove the image 
    $(document).on("click", '#remove-image', function () {
        $("input[name=photo]").val('');
        $(".img-fake").addClass("hollow").html('');
        $(this).addClass("hidden");
    });
    /*Select categories*/
    $(document).on("change", "select[name=categorie_temp]", function(){
        var id = $(this).val(), text = $(this).find('option:selected').text(), total = 0, $destiny = $("#categories-selecteds");
        if(id == 0) return;
        $destiny.find("span[data-id="+id+"]").each(function(){
            $(this).fadeOut(300, function(){
                $(this).fadeIn(100, function(){
                    $(this).fadeOut(300, function(){
                        $(this).fadeIn(100, function(){
                        });
                    });
                });
            });
            total++;
        });
        if(total == 0){
            setCategorie(text, id);
        }
        $(this).prop('selectedIndex', 0);
    });
    /**
     * Adicionar categoria
     */
    function setCategorie(text, id){
        $destiny = $("#categories-selecteds");
        var obj = '<span class="tag label label-default" data-id="'+id+'">';
            obj += text;
            obj += '<span data-role="remove"></span></span>';
        $destiny.append(obj);
    }
    /*Remove categorie*/
    $(document).on("click", ".tag > span", function(){
        var $remove = $(this).parent('span');
        $remove.fadeOut(300, function(){
            $(this).remove();
        });
    });
    /* Switch area image send */
    function changeAreaImage(area)
    {
        $("#modal-files").modal('show');
        imageAction = area;
    }
    /* Show image */
    function showImage(url) 
    {
        if(imageAction == 'principal')
        {
            $("input[name=photo]").val(url);
            $(".img-fake").removeClass("hollow").html('<img src="'+url+'">');
            $("#remove-image").removeClass("hidden");   

        }else
        {
            $content.summernote('insertImage', url, function ($image) {
               $image.attr('class', 'img-responsive');
            });
        }
        $("#modal-files").modal('hide');        
    }
    
    /*
    * Preenche o formulário com as variáveis e envia
     */
    function saveBlog()
    {
        $("input[name=categories]").val(getCategories());

        $("input[name=photo]").val($(".img-fake > img").attr("src"));
        
        $("textarea[name=content]").val($content.summernote('code'));

        inputs = ['author_temp', 'meta_title_temp', 'meta_description_temp', 'publish_at_temp', 'unpublished_at_temp'];

        setMeta(inputs);

        $("form#form-blog").submit();

    }
    /*
    * Retorna as categorias selecionadas pelo usuário
     */
    function getCategories(){
        var dados = [];
        $("#categories-selecteds").find('.tag').each(function(){
            dados.push($(this).attr("data-id"));
        });
        return JSON.stringify(dados);
    }
    /*
    *   Adiciona o valor do fake input no input final 
    */
    function setMeta(inputs){
        for(key in inputs){
            var value = $("*[name="+inputs[key]+"]").val();
            var name = inputs[key].replace("_temp", "");
            $("*[name="+name+"]").val(value);            
        }
    }