(function($) {
    "use strict";
    $.fn.OLDrop = function(options) {
        var $el = $(this);
        var defaults = {
            'action'      : "",
            'method'      : "POST",
            'enctype'     : "multipart/form-data",
            'inputName'   : 'file',
            'inputAccept' : false,
            'multiples'   : true,
            'inputHidden' : false,
            'afterUpload'	: false,
            'name'        : "libardi-drop-and-drag-"+Math.random(),

        };
        var settings = $.extend( {}, defaults, options );
        if ( settings.inputAccept != false ){
            settings.inputAccept = settings.inputAccept.replace(/ /g,"").split(",");
        }

        var $form		      = $('form[name="'+settings.name+'"]'),
        $input		     = $form.find( 'input[type="file"]' ),
        droppedFiles = false;


        $el.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $el.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $el.removeClass('is-dragover');
        })
        .on('drop', function(e) {
            e.preventDefault();
            sendFiles(e);
        });

        $( document ).on('click', '.list-files > li > a', function(e){
            e.preventDefault();
            $(this).parent('li').remove();
            if(settings.multiples == false){ $el.fadeIn(300); }
        });

        function init(){
            var obj = '<form action="'+settings.action+'" ';
            obj += 'name="'+settings.name+'" ';
            obj += 'method="'+settings.method+'" ';
            obj += 'enctype="'+settings.enctype+'" ';
            obj += 'style="visibility: hidden; position: absolute; top: 0px; left: 0px; height: 0px; width: 0px;">';
            obj += '<input id="the-file" type="file" class="do-not-clean" ';
            obj += 'name="'+settings.inputName;
            if( settings.multiples != false ){
                obj += '[]" ';
                obj += 'multiples ';
            }else{
                obj += '" ';
            }
            obj += 'accept="'+settings.inputAccept+'" ';
            obj += 'style="visibility: hidden; height: 0px; width: 0px;"> ';


            if( settings.inputHidden ){
                for(var key in settings.inputHidden) {
                    if(settings.inputHidden.hasOwnProperty(key)){

                        obj +='<input class="do-not-clean" type="hidden" name="'+key+'" value="'+settings.inputHidden[key]+'">';
                    }
                }
            }
            obj += '</form>';
            $el.html ( obj );
            var obj2 = '<ul class="list-files"> </ul>';
            $el.after ( obj2 );
        }



        function sendFiles(e){
            e.preventDefault();
            if( $el.hasClass('active')  ) { return false; }
            $(".list-error").remove();

            var progress = '<div id="dropDropProgreess"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>';

            $el.after(progress);

            $el.addClass('active');
            var $form		      = $('form[name="'+settings.name+'"]'),
            $input		     = $( 'input[type="file"]' ),
            droppedFiles = e.originalEvent.dataTransfer.files,
            fileInput = document.getElementById('the-file'),
            ajaxData = new FormData($form.get(0));



            if(!checkMineType(droppedFiles)){
                showError('Você não pode usar este tipo de arquivo.');
                return false;
            }


            if( droppedFiles ){
                Array.prototype.forEach.call( droppedFiles, function( file ){
                    ajaxData.append('file[]', file );

                });
            }


            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                async : true,
                xhr        : function ()
                {
                    var jqXHR = null;
                    if ( window.ActiveXObject )
                    {
                        jqXHR = new window.ActiveXObject( "Microsoft.XMLHTTP" );
                    }
                    else
                    {
                        jqXHR = new window.XMLHttpRequest();
                    }
                    //Upload progress
                    jqXHR.upload.addEventListener( "progress", function ( evt )
                    {
                        if ( evt.lengthComputable )
                        {
                            var percentComplete = Math.round( (evt.loaded * 100) / evt.total );
                            //Do something with upload progress
                            $("#dropDropProgreess > .progress > .progress-bar").css({'width' : percentComplete + "%"}).html(percentComplete + "%");
                        }
                    }, false );
                    //Download progress
                    jqXHR.addEventListener( "progress", function ( evt )
                    {
                        if ( evt.lengthComputable )
                        {
                            var percentComplete = Math.round( (evt.loaded * 100) / evt.total );

                        }
                    }, false );
                    return jqXHR;
                },
                beforeSend : function(){
                    console.log("Enviando...");
                },
                success: function(response) {
                    //console.clear();
                    console.log("response", response);
                    appendFiles(response.message);
                    $el.removeClass('active');
                    $input.val("");
                },
                error: function(exr) {
                    //console.clear();
                    $el.removeClass('active');
                    $input.val("");
                    console.log("ERROR", "exr", exr);
                    showError(exr.responseJSON.message);

                },
                complete : function(response){
                    console.log("Enviado!", response);
                    $("#dropDropProgreess").remove();
                }
            });
        }

        function appendFiles(message){

            if(settings.afterUpload != false && typeof settings.afterUpload == 'function'){
                return settings.afterUpload ( message ) ;
            }
            var obj = '';
            for (var i = 0; i < message.length ; i++) {

                obj +='<li data-folder="'+message[i].folder+'" data-file="'+message[i].name+'">';
                if(extensionIcon(message[i].type.toLowerCase())=='jpg' || extensionIcon(message[i].type.toLowerCase())=='jpeg' || extensionIcon(message[i].type.toLowerCase())=='png'){
                    obj +='<span><img src="'+message[i].folder+message[i].name+'" /></span>';
                }else{
                    obj +='<span class="file file-'+extensionIcon(message[i].type.toLowerCase())+'"> </span>';
                }

                obj +='<span class="file-name">'+message[i].name+'</span>';
                obj += '<input type="text" name="title_image" placeholder="Descrição da imagem...">';
                obj +='<a href="javascript:;" class="btn btn-danger btn-sm btn-block btn-remove-file">Remover</a>	</li>';
            }

            $(".list-files").append(obj);
            if(settings.multiples === false){
                //$el.fadeOut(300);
            }


        }
        function extensionIcon(ext){
            var icon = 'outher';
            if ( ext === 'zip' ){
                icon = 'zip';
            }else if( ext === 'png'){
                icon = 'png';
            }else if( ext === 'jpg' || ext === 'jpeg'){
                icon = 'jpg';
            }
            return icon;
        }

        function checkMineType(dados){
            var check = true;
            for (var i = 0; i < dados.length; i++) {
                if ( settings.inputAccept.indexOf(dados[i].type) <= -1 ) {
                    console.log("type", settings.inputAccept, dados[i].type);
                    check = false;
                    return;
                }
            }
            return check;
        }

        function showError(msg){
            var obj = '<div class="list-error">';
            if(!Array.isArray(msg) ){
                obj += msg;
            }else{
                for (var i = 0; i < msg.length; i++) {
                    obj += msg[i] + '<br />';
                }
            }

            obj +='</div>';
            $el.before(obj);
            $el.removeClass('active');
            $input.val("");

        }
        //var

        return init();
    };
}(jQuery));
