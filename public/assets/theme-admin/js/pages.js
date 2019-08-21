
/*callback do formulário*/
function pageCallback(a){
    window.location = a['edit_route'];
}
/*Ações antes de enviar o formulário*/
function savePageTemplate(){
    var contents = $('#iframe')[0].contentWindow.getAllValues();
    $("input[name=contents]").val(JSON.stringify(contents));
    $("form#form-page").submit();

}
/*Alterar a imagem*/
function changeImage(a){
    $("input[name=image_content]").val(a);
    $("#modal-files").modal('hide');
}
/*Alimenta o formulário do modal e exibe*/
function setValues(id, dados, name){
    $("input[name="+name+"_id]").val(id);
    for(var key in dados){
        console.log(key, dados[key].value);
        $(dados[key].type+"[name="+name+key+"]").val(dados[key].value);
    }
    $("#modal-"+name).modal('show');
}
/*Resgata os valores do iframe*/
function getValues(name){
    if( name == 'title' ){
        var result = {
            _content : { value : '', type : 'input'},
            _type : { value : '', type : 'select'},
            _css : { value : '', type : 'input'},
            _style : { value : '', type : 'input'},
            _link : { value : null, type : 'input'},
            _link_target : { value : null, type : 'select'}
        };
    }else if(name == 'content'){
        var result = {
            _content: {
                value: '',
                type: 'textarea'
            },
            _type : {
                value : 'div',
                type : '',
            },
            _css : {
                value : '',
                type : 'input',
            },
            _style : {
                value : '',
                type  : 'input'
            },
        };
    }else if(name== 'image'){
        var result = {
            _content : { value : '', type : 'input'},
            _type : { value : '', type : 'select'},
            _css : { value : '', type : 'input'},
            _style : { value : '', type : 'input'},
            _link : { value : null, type : 'input'},
            _link_target : { value : null, type : 'select'}
        };
    }

    for(var key in result){
        result[key].value = $(result[key].type+"[name="+name+key+"]").val();
    }
    return result;
}


/*Evento para formulário de títulos*/
$(document).on("click", "button[name=save_title]", function(e){
    e.preventDefault();
    $('#iframe')[0].contentWindow.setTypes($("input[name=title_id]").val(), getValues('title'), 'title');
    $("#modal-title").modal('hide');
});
/*Evento para formulário de conteúdo*/
$(document).on("click", "button[name=save_content]", function(e){
    e.preventDefault();
    $('#iframe')[0].contentWindow.setTypes($("input[name=content_id]").val(), getValues('content'), 'content');
    $("#modal-content").modal('hide');
});
/*Evento para formulário de imagem*/
$(document).on("click", "button[name=save_image]", function(e){
    e.preventDefault();
    $('#iframe')[0].contentWindow.setTypes($("input[name=image_id]").val(), getValues('image'), 'image');
    $("#modal-image").modal('hide');
});
