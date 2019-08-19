if (typeof jQuery === 'undefined') {
    throw new Error('OLTemplates JavaScript requires jQuery');
}

var $document = $(document);
//finaliza a navegação no template
$(document).on("click", "a", function (e) {
    e.preventDefault();
});


$(document).ready(function () {
    initButtons();
    $(document).on("click", "button[name=edit_title], button[name=edit_content], button[name=edit_image]", function () {
        identifyObject($("*[data-id=" + $(this).attr("data-target") + "]"));
    });

    $(document).on("click", "button[name=delete_title], button[name=delete_content], button[name=delete_image]", function () {
        $(".ol-btn-group[data-target=" + $(this).attr("data-target") + "]").remove();
        $("*[data-id=" + $(this).attr("data-target") + "]").remove();
        destroyButtons();
        setTimeout(function(){ initButtons(); }, 200);
    });

});




function setMessage(type, id) {
    if (typeof window.parent.olMessage == 'function') {
        console.log("enviar para parent: ", type, id);
        window.parent.olMessage(type, id);
        return;
    }
}

function identifyObject($this) {

    var type, id, dados;
    type = $this.attr('data-type');
    id = $this.attr('data-id');

    if (type == 'title') {

        dados = getTitleVars($this);

    }else if(type == 'content'){

        dados = getContentVars($this);

    }else if(type == 'image'){
        dados = getImageVars($this);
    }

    window.parent.setValues(id, dados, type);
}
/*
 * setTypes
*/
function setTypes(id, dados, type){
    var obj = "";
    if(type == 'title' || type == 'content'){
        obj = setVars(id, dados);
    }else if(type == 'image'){
        obj = setImage(id, dados);
    }
    $("*[data-id=" + id + "]").html(obj);
    destroyButtons();
    setTimeout(function(){ initButtons(); }, 200);
}
/*
* Set vars
*/
function setVars(id, dados) {
    var obj = "";

    obj += '<' + dados['_type'].value;
    obj += ' data-edit="true" ';
    if (dados['_css'].value) {
        obj += ' class="' + dados['_css'].value + '"';
    }

    if (dados['_style'].value) {
        obj += ' style="' + dados['_style'].value + '"';
    }
    obj += '>';
    //link somente para imagem e títulos
    if (typeof dados['_link'] == 'object' && dados['_link'].value) {
        obj += '<a href="' + dados['_link'].value + '"';
        obj += ' title="' + dados['_content'].value + '"'
        if (dados['_link_target'].value) {
            obj += ' target="' + dados['_link_target'].value + '"';
        }
        obj += '>';
    }

    obj += dados['_content'].value;

    //link somente para imagem e títulos
    if (typeof dados['_link'] == 'object' && dados['_link'].value) {
        obj += '</a>';
    }

    obj += '</' + dados['_type'].value + '>';

    return obj;

}
/*Set image*/
function setImage(id, dados){

    var obj = "";

    if (typeof dados['_link'] == 'object' && dados['_link'].value) {

        obj += '<a data-edit="true" href="' + dados['_link'].value + '"';

        if (dados['_link_target'].value) {
            obj += ' target="' + dados['_link_target'].value + '"';
        }

        obj += '>';
        obj += '<img src="'+dados['_content'].value+'"';
    }else{
        obj += '<img data-edit="true" src="'+dados['_content'].value+'"';
    }



    if (dados['_css'].value) {
        obj += ' class="' + dados['_css'].value + '"';
    }

    if (dados['_style'].value) {
        obj += ' style="' + dados['_style'].value + '"';
    }

    obj += '>';

    if (typeof dados['_link'] == 'object' && dados['_link'].value) {
        obj += '</a>';
    }

    return obj;

}

function getAllValues(){
    //melhorar não posso passar o id como key
    console.log('iniciando getAllValues');
    var dados = [], i=0, contents = [];
    $("body").find('*[data-editable=true]').each(function () {

        var type = $(this).attr("data-type"),
              id = $(this).attr("data-id");

        if(type=='title'){
            dados[i] = getTitleVars($(this));
            contents[i]  = {'id' : id, 'content' : setVars(id, dados[i])};
        }else if(type == 'content'){
            dados[i] = getContentVars($(this));
            contents[i]  = {'id' : id, 'content' : setVars(id, dados[i])};
        }else if(type == 'image'){
            dados[i] = getImageVars($(this));
            contents[i]  = {'id' : id, 'content' : setImage(id, dados[i])};
        }
        i++;
    });
    console.log('retorno: ', contents);
    return contents;

}


/*get content*/
function getContentVars($this){
    var result = {
        _id : '',
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

    var $child = $('span[data-id='+$this.attr("data-id")+'] > div');

    result['_id'] = $this.attr("data-id");
    result['_css'].value = $child.attr("class");

    result['_style'].value = $child.attr("style");

    result['_content'].value = $child.html();
    return result;
}
/*get title*/
function getTitleVars($this) {
    var result = {
        _id : '',
        _content: {
            value: '',
            type: 'input'
        },
        _type: {
            value: '',
            type: 'select'
        },
        _css: {
            value: '',
            type: 'input'
        },
        _style: {
            value: '',
            type: 'input'
        },
        _link: {
            value: '',
            type: 'input'
        },
        _link_target: {
            value: '',
            type: 'select'
        }
    };
    result['_id'] = $this.attr("data-id");
    $this.find("h1, h2, h3, h4, h5, h6, h7, img").each(function () {

        result['_content'].value = $(this).text();
        result['_type'].value = $(this).prop("tagName").toLowerCase();
        result['_css'].value = $(this).attr("class");
        result['_style'].value = $(this).attr("style");

        $this.find($(this).prop("tagName").toLowerCase() + " a").each(function () {
            result['_link'].value = $(this).attr('href');
            result['_link_target'].value = $(this).attr("target");
        });

    });

    return result;
}
/*get image*/
function getImageVars($this) {
    var result = {
        _id : '',
        _content: {
            value: '',
            type: 'input'
        },
        _type: {
            value: '',
            type: 'select'
        },
        _css: {
            value: '',
            type: 'input'
        },
        _style: {
            value: '',
            type: 'input'
        },
        _link: {
            value: '',
            type: 'input'
        },
        _link_target: {
            value: '',
            type: 'select'
        }
    };
    result['_id'] = $this.attr("data-id");
    $this.find("img").each(function () {

        result['_content'].value = $(this).attr('src');
        result['_type'].value = $(this).prop("tagName").toLowerCase();
        result['_css'].value = $(this).attr("class");
        result['_style'].value = $(this).attr("style");

    });

    $this.find("a").each(function () {
        result['_link'].value = $(this).attr('href');
        result['_link_target'].value = $(this).attr("target");
    });


    return result;
}
/*
* init buttons
*/
function initButtons(){
    $("body").find('*[data-editable=true]').each(function () {

        $(this).find('h1, h2, h3, h4, h5, h6, img, div').each(function () {
            $(this).css({
                display: 'inline-block'
            });
        });


        createButtons($(this));
    });
}
/*
* Create buttons
*/
function createButtons($this) {
    var obj, style, style_btn, style_btn_edit, style_btn_delete, top, width, left;

    top = eval(parseInt($this.offset().top) - 10);
    width = eval(($this.width() / 2) - 40);
    left = eval(parseInt($this.offset().left) + width);

    $this.find('h1, h2, h3, h4, h5, h6, img, div').each(function () {
        top = eval(parseInt($(this).offset().top) - 10);
        width = $(this).width();
        left = eval(parseInt($(this).offset().left) + width);
        $(this).css({
            display: ''
        });
    });

    $this.css({
        display: ''
    });

    style = 'position: absolute; float: left; width: 80px; height: auto; left:' + left + 'px; top:' + top + 'px;';

    style_btn = 'display: inline-block; padding: 5px 10px; margin-bottom: 0; font-size: 12px; font-weight: 400; line-height: 1.5;	text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; border: 1px solid transparent; border-radius: 4px; widht:32px; height:30px;';

    style_btn_edit = ' background-color: #f8ac59; border-color: #f8ac59; color: #FFFFFF; margin-right:5px;';

    style_btn_delete = ' background-color: #ec4758; border-color: #ec4758; color: #FFFFFF;';

    obj = '<div class="ol-btn-group" style="' + style + '" data-target="' + $this.attr("data-id") + '">';
    obj += '<button type="button" style="' + style_btn + style_btn_edit + '" name="edit_' + $this.attr("data-type") + '" data-type="' + $this.attr("data-type") + '" data-target="' + $this.attr("data-id") + '">';
    obj += '<img src="/assets/theme-admin/images/pencil.svg" style="display:block; max-width:15px;">';
    obj += '</button>';
    obj += '<button type="button" style="' + style_btn + style_btn_delete + '" name="delete_' + $this.attr("data-type") + '" data-type="' + $this.attr("data-type") + '" data-target="' + $this.attr("data-id") + '">';
    obj += '<img src="/assets/theme-admin/images/trash.svg" style="display:block; max-width:15px;">';
    obj += '</button>';
    obj += '</div>';

    $('body').append(obj);

}
/*
* Destroy buttons
*/
function destroyButtons(){
    $(".ol-btn-group").remove();
}
