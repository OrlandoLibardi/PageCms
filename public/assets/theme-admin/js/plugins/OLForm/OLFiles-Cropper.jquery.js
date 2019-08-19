(function ($) {
  "use strict";
  $.fn.OLFiles = function (options, callback) {
    var $el = $(this);
    var $document = $(document);
    var $body = $('body');
    var defaults = {
      actionListFolders: '',
      methodListFolders: 'GET',
      actionCreateFolder: '',
      methodCreateFolder: 'POST',
      actionOpenFile: '',
      methodOpenFile: 'GET',
      actionSendFile: '',
      methodSendFile: 'POST',
      inputSendName: 'file',
      inputAccept: 'image/jpeg,image/png,image/gif',
      areaDrop: '#OLFiles-dropzone',
      areaListFiles: '#OLFiles-list-files',
      areaListDirs: '#OLFiles-list-dir',
      areaFormFolder: '#OLFiles-form-folder',
      token: false,
      initialFolder: '',
      textSendding: 'Aguarde Carregando...',
      btnSubmitText: 'ENVIAR',
      btnSubmitClass: 'btn btn-primary',
      btnCancelText: 'CANCELAR',
      btnCancelClass: 'btn btn-danger pull-right',
      listErrorPosition: 'after',
      listErrorPositionBlock: '.page-heading',
      name: "libardi-drop-and-drag-" + Math.random(),
      textConfirm: 'Deseja EXCLUIR %REPLACE% selecionado?',
      textConfirmButton: 'Sim, Excluir!',
      textAbortButton: 'Não, Abortar!',
    };
    var selectedFolder = false;
    var selectedFile = false;
    var settings = $.extend({}, defaults, options);

    function init() {
      settings.inputAccept = settings.inputAccept.replace(/ /g, "").split(",");
      checkValues();
      getFilesAndFolders(settings.initialFolder);
      initFromFolder(settings.initialFolder);
      initFormFiles();
    }
    /*modelo list folders*/
    function initListFolders(directories) {
      var obj = '';
      $.each(directories, function (a, b) {
        obj += '<div class="file-box">';
        obj += '<button class="btn btn-xs btn-danger btn-flat folder-delete" data-folder="' + b.path + '"><i class="fa fa-trash"></i></button>';
        //obj += '<button class="btn btn-xs btn-warning btn-flat folder-rename" data-folder="' + b.path + '"><i class="fa fa-pencil"></i></button>';
        obj += '<div class="file">';
        obj += '<a href="javascript:;" data-folder="' + b.path + '"  class="dir-navigator">';
        obj += '<div class="icon">';
        obj += '<i class="fa fa-folder"></i>';
        obj += '</div>';
        obj += '<div class="file-name">';
        obj += '<p>' + b.name + '</p>';
        obj += '<small>' + b.time + '</small>';
        obj += '</div>';
        obj += '</a>';
        obj += '</div>';
        obj += '</div>';
      });
      return obj;
    }
    /*modelo list files*/
    function initListFiles(files) {
      var obj = '';
      $.each(files, function (a, b) {
        obj += '<div class="file-box">';
        obj += '<button class="btn btn-xs btn-danger btn-flat file-delete" data-basename="'+ b.basename +'" data-dir="'+b.dir+'" data-url="' + b.url + '"><i class="fa fa-trash"></i></button>';
        obj += '<button class="btn btn-xs btn-info btn-flat file-edit" data-width="'+b.width+'" data-height="'+b.height+'" data-basename="'+ b.basename +'" data-dir="'+b.dir+'" data-url="' + b.url + '"><i class="fa fa-pencil"></i></button>';
        obj += '<div class="file">';
        obj += '<a href="javascript:;" class="filed"  data-folder="' + b.realname + '" data-extension="' + b.extension + '" data-url="' + b.url + '" data-width="' + b.width + '" data-height="' + b.height + '">';
        obj += '<div class="image">';
        obj += '<img src="' + b.url + '" class="img-responsive center-block">';
        obj += '</div>';
        obj += '<div class="file-name">';
        obj += '<p>' + b.name + '.' + b.extension + '</p>';
        obj += '<small>' + b.time + '</small>';
        obj += '</div>';
        obj += '</a>';
        obj += '</div>';
        obj += '</div>';
      });
      return obj;
    }

    function initFromFolder(directory) 
    {
      var obj = '<form name="create-folder" id="create-folder" onSubmit="return false">';
      obj += '<input type="hidden" name="base_path" value="' + directory + '">';
      obj += '<div class="input-group input-group-sm">';
      obj += '<input name="name" type="text" class="form-control" placeholder="Nova Pasta...">';
      obj += '<span class="input-group-btn">';
      obj += '<button class="btn btn-default btn-folder" type="button" name="send-new-folder">OK</button>';
      obj += '</span>';
      obj += '</div>';
      obj += '</form>';
      $(settings.areaFormFolder).html(obj);
    }
    /*modelo list breadcrumbs*/
    function initBreadcrumbs(folder) {
      var f = folder.split("/"),
        total = f.length,
        tempfolder = '',
        obj = '<ol class="breadcrumb">';
      for (var key in f) {
        if (key == 0) {
          tempfolder += f[key];
          obj += '<li> <a href="javascript:;" class="dir-navigator" data-folder="' + tempfolder + '"><i class="fa fa-home"></i></a> </li>';
        }
        else {
          tempfolder += "/" + f[key];
          if (eval(parseInt(key) + 1) == total) {
            obj += '<li class="active">' + f[key] + '</li>';
          }
          else {
            obj += '<li><a href="javascript:;" class="dir-navigator" data-folder="' + tempfolder + '">' + f[key] + '</a></li>';
          }
        }
      }
      obj += '</ol>';
      return obj;
    }
    /*Load files anda folders*/
    function getFilesAndFolders(folder) {
      $(".olform-error-list").remove();
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': settings.token
        }
      });
      $.ajax({
        data: {
          'directory': folder
        },
        method: settings.methodListFolders,
        url: settings.actionListFolders,
        beforeSend: function () {
          showAlert(settings.textSendding, 'loading');
        },
        success: function (exr) {
          //showAlert(exr.message, exr.status);
          //List Files
          var obj = initListFolders(exr.directories);
          obj += initListFiles(exr.files);
          $(settings.areaListFiles).html(obj);
          $(settings.areaListDirs).html(initBreadcrumbs(exr.directory));
          $("#create-folder input[name=base_path]").val(exr.directory);
          closeAlert();
        },
        error: function (exr, sender) {
          showAlert(exr.responseJSON.message, exr.responseJSON.status);
        },
        complete: function () {
        },
      });
    }
    /*Create folder*/
    function setFolder() {
      $(".olform-error-list").remove();
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': settings.token
        }
      });
      $.ajax({
        data: $("#create-folder").serialize(),
        method: settings.methodCreateFolder,
        url: settings.actionCreateFolder,
        beforeSend: function () {
          showAlert(settings.textSendding, 'loading');
        },
        success: function (exr) {
          var directory = $("#create-folder input[name=base_path]").val() + '/' + $("#create-folder input[name=name]").val();
          getFilesAndFolders(exr.directory);
          $("#create-folder input[name=name]").val("");
          getFiles(directory);
        },
        error: function (exr, sender) {
          showAlert(exr.responseJSON.message, exr.responseJSON.status);
        },
        complete: function () {
        },
      });
    }
    /*init form files*/
    function initFormFiles() {
      var obj = '<form action="' + settings.actionSendFile + '" ';
      obj += 'name="' + settings.name + '" ';
      obj += 'method="' + settings.methodSendFile + '" ';
      obj += 'enctype="multipart/form-data">';
      obj += '<input id="the-file" type="file" class="do-not-clean" ';
      obj += 'name="' + settings.inputSendName;
      obj += '[]" ';
      obj += 'multiples ';
      obj += 'accept="image" ';
      obj += 'style="visibility: hidden; height: 0px; width: 0px;"> ';
      obj += '</form>';
      obj += '<ul class="list-files"> </ul>';
      $(settings.areaDrop).html(obj);
    }

    /*CHECK VALUES*/
    function checkValues() {
      /* ACTIONS */
      if (!settings.actionListFolders) console.log("OLFiles: ACTION LIST FOLDER não encontrada!");
      if (!settings.actionCreateFolder) console.log("OLFiles: ACTION CREATE FOLDER não encontrada!");
      if (!settings.actionOpenFile) console.log("OLFiles: ACTION OPEN FILE não encontrada!");
      if (!settings.actionSendFile) console.log("OLFiles: ACTION SEND FILE não encontrada!");
      if (!settings.initialFolder) console.log("OLFiles: INITIAL FOLDER não configurada!");
      /* AREAS */
      if (!$(settings.areaDrop)) console.log("OLFiles: DROP AREA não encontrada!");
      if (!$(settings.areaListFiles)) console.log("OLFiles: LIST FILES AREA não encontrada!");
      if (!$(settings.areaListDirs)) console.log("OLFiles: LIST DIRECTORIES AREA não encontrada!");
      if (!$(settings.areaFormFolder)) console.log("OLFiles: FORM FOLDER AREA não encontrada!");
      /* TOKEN */
      if (!settings.token) findToken();
    }
    /*FIND TOKEN*/
    function findToken() {
      var token = ($("meta[name=csrf-token]")) ? $("meta[name=csrf-token]").attr("content") : false;
      token = (!token) ? $("input[name=_token]").val() : token;
      token = (!token) ? $("input[name=token]").val() : token;
      if (!token) console.log('OLFiles: TOKEN e ou CSRF-TOKEN não encontrados!');
      settings.token = token;
    }
    /*ALERT*/
    function showAlert(msg, status) {
      $(".olform-response").remove();
      var obj = '<div class="olform-response" id="OLFORM-response">';
      obj += '<div>';
      if (status == 'success') {
        obj += '<span class="olform-icon-success"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg + '<br />';
        obj += '<a href="javascript:;" class="btn-close-olform-success btn btn-primary text-uppercase">Fechar</a>';
        obj += '</p>';
      }
      else if (status == 'loading') {
        obj += '<span class="olform-icon-load"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg;
        obj += '</p>';
      }
      else if (status == 'error') {
        obj += '<span class="olform-icon-error"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg + '<br />';
        obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
        obj += '</p>';
      } else if (status == 'confirm') {
        obj += '<span class="olform-icon-confirm"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg + '<br />';
        obj += '<a href="javascript:;" class="btn-confirm btn btn-primary text-uppercase">' + settings.textConfirmButton + '</a>'
        obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">' + settings.textAbortButton + '</a>';
        obj += '</p>';
      }
      obj += '</div>';
      obj += '</div>';
      $body.append(obj);
    }
    /*CLOSE ALERT*/
    function closeAlert() 
    {
      $(".olform-response > div").fadeOut(300, function () {
        $(".olform-response").fadeOut(300, function () {
          $(".olform-response").remove();
        });
      });
    }
    /*SEND FILES*/
    function sendFiles(e) 
    {
      if ($(settings.areaDrop).hasClass("active")) return false;
      var progress = '<div id="dropDropProgreess"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>';
      $(settings.areaDrop).after(progress);
      var $form = $('form[name="' + settings.name + '"]'),
        $input = $('input[type="file"]'),
        droppedFiles = e.originalEvent.dataTransfer.files,
        fileInput = document.getElementById('the-file'),
        directory = $("input[name=base_path]").val(),
        ajaxData = new FormData($form.get(0));
      if (!checkMineType(droppedFiles)) {
        showAlert('Você não pode enviar esse tipo de arquivos.', "error");
        return false;
      }
      $(settings.areaDrop).addClass('active');
      ajaxData.append('dir', directory);

      if (droppedFiles) Array.prototype.forEach.call(droppedFiles, function (a) {
        ajaxData.append("file[]", a);
      });
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': settings.token
        }
      });
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: ajaxData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        async: true,
        xhr: function () {
          var jqXHR = null;
          if (window.ActiveXObject) {
            jqXHR = new window.ActiveXObject("Microsoft.XMLHTTP");
          }
          else {
            jqXHR = new window.XMLHttpRequest();
          }
          //Upload progress
          jqXHR.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded * 100) / evt.total);
            }
          }, false);
          return jqXHR;
        },
        beforeSend: function () {
          showAlert(settings.textSendding, 'loading');
        },
        success: function (exr) {
          getFilesAndFolders(directory);
          $(settings.areaDrop).removeClass('active');
          $input.val("");
        },
        error: function (exr) {
          $(settings.areaDrop).removeClass('active');
          $input.val("");
          showAlert(exr.responseJSON.message, 'error');
        },
        complete: function (exr) {
          closeAlert();
        }
      });
    }
    /* CHECK MINE TYPE */
    function checkMineType(dados) {
      var check = true;
      for (var i = 0; i < dados.length; i++) {
        if (settings.inputAccept.indexOf(dados[i].type) <= -1) {
          check = false;
          return;
        }
      }
      return check;
    }

    function openFile(a) 
    {
      if (typeof settings.actionOpenFile == 'function') {
        settings.actionOpenFile.call(this, a);
      }
    }
    /* Close modal edit image */
    function closeModalEdit()
    {
      selectedFile = false;
      $("#image").attr("src", "");
      $(".modal-edit-image").toggleClass("open");
      closeCallback();
    }
    /* EVENTS */
    $document.on("click", ".btn-close-olform-success", function () {
      closeAlert();
    });
    $document.on("click", ".btn-close-olform-error", function () {
      closeAlert();
    });
    $document.on("click", "a.dir-navigator", function () {
      return getFilesAndFolders($(this).attr("data-folder"));
    });

    $document.on("click", "a.filed", function () {
      openFile($(this).attr("data-url"));
    });

    $document.on("click", "button[name=send-new-folder]", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setFolder();
    });
    $(settings.areaDrop).on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
    }).on('dragover dragenter', function () {
      $(settings.areaDrop).addClass('is-dragover');
    }).on('dragleave dragend drop', function () {
      $(settings.areaDrop).removeClass('is-dragover');
    }).on('drop', function (e) {
      e.preventDefault();
      sendFiles(e);
    });
    /*
      Exclude
    */
    $document.on("click", 'button.folder-delete', function () {
      selectedFolder = $(this).attr("data-folder");
      selectedFile = '';
      showAlert(settings.textConfirm.replace('%REPLACE%', 'pasta'), 'confirm')
    });
    $document.on("click", ".btn-confirm", function () {
      closeAlert();
      //Enviar exclude file or folder
      var action =  $("input[name=action_delete_folder]").val(),
          method = 'DELETE', 
          data = {
            folder : selectedFolder, 
            image : selectedFile
            };
      if(selectedFile != '')
      {
        action = $("input[name=action_delete_file]").val(); 
      }
    
      newSend(action, method, data);

    });
    /*
      Rename
    */
    $document.on("click", 'button.folder-rename', function () {      
      selectedFolder = $(this).attr("data-folder");
    });
    /*
    * Edit Image
    */
    $document.on("click", 'button.file-edit', function () {
      selectedFile = $(this).attr("data-url");
      $("#image").attr("src", selectedFile);
      $(".modal-edit-image").toggleClass("open");
      $("input[name=hidden_image], input[name=view_image]").val($(this).attr("data-basename"));
      $("#view_folder").html($(this).attr("data-dir")+"/");
      $("input[name=image_size_width]").val($(this).attr("data-width"));
      $("input[name=image_size_width]").attr("data-value", $(this).attr("data-width"));
      $("input[name=image_size_height]").val($(this).attr("data-height"));
      $("input[name=image_size_height]").attr("data-value", $(this).attr("data-height"));
      $("input[name=image_data_url]").val(selectedFile);
      readyCallback(selectedFile);
    });
    /*
    * Delete Image
    */
    $document.on("click", 'button.file-delete', function () {
      selectedFile = $(this).attr("data-basename");
      selectedFolder = $(this).attr("data-dir");
      showAlert(settings.textConfirm.replace('%REPLACE%', 'arquivo'), 'confirm')
      //Abrir Rotina para editar arquivos
    });
    /*
    * Close modal edit image 
    */
    $document.on("click", ".btn-close-edit-image", function () {
      closeModalEdit();
    });
    /*
    * Rename file
    */
    $document.on("click", ".btn-rename-send", function () {
      var action = $("input[name=action_image_rename]").val(), 
          method = $("input[name=method_image_rename]").val(), 
          data = {
            folder : $("#view_folder").html(), 
            image : $("input[name=hidden_image]").val(),
            new_image : $("input[name=view_image]").val()
            };
      closeModalEdit();
      newSend(action, method, data);
    });
    /* 
    * Resize image 
    */
    $document.on("click", ".btn-resize-image", function () {
      var  size = {
        x: 0, 
        y: 0, 
        width: 0, 
        height: 0, 
        r_width: $("input[name=image_size_width]").val(),
        r_height: $("input[name=image_size_height]").val(),
        rotate: 0,              
        directionX: false, 
        directionY: false, 
      };
      var action = $("input[name=action_edit_image]").val(), 
          method = "PUT", 
          data = {
            folder : $("#view_folder").html(), 
            image : $("input[name=hidden_image]").val(),
            rename : $("input[name=methodSave]").is(":checked") ? 1 : 0,
            size : size
            };
            closeModalEdit();
            newSend(action, method, data); 
    });
    $document.on("click", ".btn-save-edit-image", function () {
      var  crop = getData();
      var  size = {
              x: parseInt(crop.x), 
              y: parseInt(crop.y), 
              width: parseInt(crop.width), 
              height: parseInt(crop.height), 
              r_width: 0,
              r_height: 0,
              rotate: parseInt(crop.rotate),              
              directionX: (crop.scaleX != 1) ? 'h' : false, 
              directionY: (crop.scaleY != 1) ? 'y' : false, 
      };
      var action = $("input[name=action_edit_image]").val(), 
          method = "PUT", 
          data = {
            folder : $("#view_folder").html(), 
            image : $("input[name=hidden_image]").val(),
            rename : $("input[name=methodSave]").is(":checked") ? 1 : 0,
            size : size
            };
            closeModalEdit();
            console.log('enviar: ', data);
            newSend(action, method, data);      

    });
    /* *
    * Resize images proportions
    */
    $document.on("click", "input[name=image_size_width], input[name=image_size_height]", function(){
      if($("button.btn-scale-image").hasClass('active')){
        $("input[name="+$(this).attr("data-target")+"]").attr("readonly", true);
      }
    });
    $document.on("change", "input[name=image_size_width]", function(){
      if($("button.btn-scale-image").hasClass('active')){
        var input_target    = $(this).attr("data-target"),
            width           = $(this).val(),
            original_width  = $(this).attr("data-value"),
            height          = $("input[name="+input_target+"]").val(),
            original_height = $("input[name="+input_target+"]").attr("data-value"),
            ressult         = scaleSize(width, height, original_width, original_height,  'w');
        $("input[name="+input_target+"]").removeAttr("readonly").val(ressult);
      }
    });
    $document.on("change", "input[name=image_size_height]", function(){
      if($("button.btn-scale-image").hasClass('active')){
        var input_target    = $(this).attr("data-target"),
            height           = $(this).val(),
            original_height  = $(this).attr("data-value"),
            width          = $("input[name="+input_target+"]").val(),
            original_width = $("input[name="+input_target+"]").attr("data-value"),
            ressult         = scaleSize(width, height, original_width, original_height,  'h');
        $("input[name="+input_target+"]").removeAttr("readonly").val(ressult);
      }      
    });

    $document.on("click", "button.btn-scale-image", function(){
      $(this).toggleClass("active");
    });

    function scaleSize(width, height, original_width, original_height,  type)
    {
      var new_value = 0, p = 0;
      if(type == 'w'){
        p = width/original_width;
        new_value = original_height * p;
      }
      else
      {
        p = height/original_height;
        new_value = original_width * p;
      }
      return Math.ceil(new_value);
    }
    /**
     * sample send form 
     * */
    function newSend(action, method, data)
    {
      $(".olform-error-list").remove();
      $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': settings.token } });
      $.ajax({
        data: data,
        method:method,
        url: action,
        beforeSend: function () {
          console.log('newSend beforeSend');
          showAlert(settings.textSendding, 'loading');
        },
        success: function (exr) 
        {          
          console.log('exr', exr);
          getFilesAndFolders(data.directory);
        },
        error: function (exr, sender) {
          console.log('newSend error', exr);
          showAlert(exr.message, exr.status);
        }
      });
    }
    init();
  }
}(jQuery));