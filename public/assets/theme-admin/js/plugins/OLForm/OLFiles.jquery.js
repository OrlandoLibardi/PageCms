(function($) {
  "use strict";
  $.fn.OLFiles = function(options, callback) {
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
    };
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
        $.each(directories, function(a, b) {
          obj += '<div class="file-box">';
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
      $.each(files, function(a, b) {
        obj += '<div class="file-box">';
        obj += '<div class="file">';
        obj += '<a href="javascript:;" class="filed" data-folder="' + b.realname + '" data-extension="' + b.size + '" data-url="' + b.url + '">';
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

    function initFromFolder(directory) {
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
        for(var key in f) {
          if(key == 0) {
            tempfolder += f[key];
            obj += '<li> <a href="javascript:;" class="dir-navigator" data-folder="' + tempfolder + '"><i class="fa fa-home"></i></a> </li>';
          }
          else {
            tempfolder += "/" + f[key];
            if(eval(parseInt(key) + 1) == total) {
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
          beforeSend: function() {
            showAlert(settings.textSendding, 'loading');
          },
          success: function(exr) {
            //showAlert(exr.message, exr.status);
            //List Files
            var obj = initListFolders(exr.directories);
            obj += initListFiles(exr.files);
            $(settings.areaListFiles).html(obj);
            $(settings.areaListDirs).html(initBreadcrumbs(exr.directory));
            $("#create-folder input[name=base_path]").val(exr.directory);
            closeAlert();
          },
          error: function(exr, sender) {
            showAlert(exr.responseJSON.message, exr.responseJSON.status);
          },
          complete: function() {
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
          beforeSend: function() {
            showAlert(settings.textSendding, 'loading');
          },
          success: function(exr) {
            var directory = $("#create-folder input[name=base_path]").val() + '/' + $("#create-folder input[name=name]").val();
            getFilesAndFolders(directory);
            $("#create-folder input[name=name]").val("");
            getFiles(directory);
          },
          error: function(exr, sender) {
            showAlert(exr.responseJSON.message, exr.responseJSON.status);
          },
          complete: function() {
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
         if (!settings.actionListFolders) throw new Error("OLFiles: ACTION LIST FOLDER não encontrada!");
									if (!settings.actionCreateFolder) throw new Error("OLFiles: ACTION CREATE FOLDER não encontrada!");
									if (!settings.actionOpenFile) throw new Error("OLFiles: ACTION OPEN FILE não encontrada!");
									if (!settings.actionSendFile) throw new Error("OLFiles: ACTION SEND FILE não encontrada!");
									if (!settings.initialFolder) throw new Error("OLFiles: INITIAL FOLDER não configurada!");
								/* AREAS */
									if (!$(settings.areaDrop)) throw new Error("OLFiles: DROP AREA não encontrada!");
									if (!$(settings.areaListFiles)) throw new Error("OLFiles: LIST FILES AREA não encontrada!");
									if (!$(settings.areaListDirs)) throw new Error("OLFiles: LIST DIRECTORIES AREA não encontrada!");
									if (!$(settings.areaFormFolder)) throw new Error("OLFiles: FORM FOLDER AREA não encontrada!");
								/* TOKEN */
									if (!settings.token) findToken();
      }
      /*FIND TOKEN*/
    function findToken() {
        var token = ($("meta[name=csrf-token]")) ? $("meta[name=csrf-token]").attr("content") : false;
        token = (!token) ? $("input[name=_token]").val() : token;
        token = (!token) ? $("input[name=token]").val() : token;
        if(!token)  throw new Error('OLFiles: TOKEN e ou CSRF-TOKEN não encontrados!'); 
        settings.token = token;
      }
      /*List error after comunication error*/
    function showErros(exr) {
        if(settings.listErrorPositionBlock) {
          var errors = "";
          $.each(exr.responseJSON.errors, function(a, b) {
            if (void 0 != b) errors += "<p>" + eval(a + 1) + " - " + b + "</p>";
          });
          var objErrors = '<div class="olform-error-list">';
          objErrors += '<div class="alert alert-danger">';
          objErrors += '<h3>' + exr.responseJSON.message + '</h3>';
          objErrors += errors;
          objErrors += '</div>';
          objErrors += '</div>';
          var $blockError = $(settings.listErrorPositionBlock);
          "after" == settings.listErrorPosition ? $blockError.after(objErrors) : $blockError.before(objErrors);
        }
      }
      /*ALERT*/
    function showAlert(msg, status) {
      $(".olform-response").remove();
      var obj = '<div class="olform-response" id="OLFORM-response">';
      obj += '<div>';
      if(status == 'success') {
        obj += '<span class="olform-icon-success"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg + '<br />';
        obj += '<a href="javascript:;" class="btn-close-olform-success btn btn-primary text-uppercase">Fechar</a>';
        obj += '</p>';
      }
      else if(status == 'loading') {
        obj += '<span class="olform-icon-load"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg;
        obj += '</p>';
      }
      else if(status == 'error') {
        obj += '<span class="olform-icon-error"></span>';
        obj += '<p class="olform-title-load">';
        obj += msg + '<br />';
        obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
        obj += '</p>';
      }
      obj += '</div>';
      obj += '</div>';
      $body.append(obj);
    }
				/*CLOSE ALERT*/
    function closeAlert() {
        $(".olform-response > div").fadeOut(300, function() {
          $(".olform-response").fadeOut(300, function() {
            $(".olform-response").remove();
          });
        });
      }
				/*SEND FILES*/
    function sendFiles(e) {
      if ($(settings.areaDrop).hasClass("active")) return false; 
      var progress = '<div id="dropDropProgreess"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>';
      $(settings.areaDrop).after(progress);
      var $form = $('form[name="' + settings.name + '"]'),
        $input = $('input[type="file"]'),
        droppedFiles = e.originalEvent.dataTransfer.files,
        fileInput = document.getElementById('the-file'),
        directory = $("input[name=base_path]").val(),
        ajaxData = new FormData($form.get(0));
      if(!checkMineType(droppedFiles)) {
        showAlert('Você não pode enviar esse tipo de arquivos.', "error");
        return false;
      }
      $(settings.areaDrop).addClass('active');
      ajaxData.append('dir', directory);
      
						if (droppedFiles) Array.prototype.forEach.call(droppedFiles, function(a) {
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
        xhr: function() {
          var jqXHR = null;
          if(window.ActiveXObject) {
            jqXHR = new window.ActiveXObject("Microsoft.XMLHTTP");
          }
          else {
            jqXHR = new window.XMLHttpRequest();
          }
          //Upload progress
          jqXHR.upload.addEventListener("progress", function(evt) {
            if(evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded * 100) / evt.total);
            }
          }, false);
          return jqXHR;
        },
        beforeSend: function() {
          showAlert(settings.textSendding, 'loading');
        },
        success: function(exr) {
          getFilesAndFolders(directory);
          $(settings.areaDrop).removeClass('active');
          $input.val("");
        },
        error: function(exr) {
          $(settings.areaDrop).removeClass('active');
          $input.val("");
          showAlert(exr.responseJSON.message, 'error');
        },
        complete: function(exr) {
          closeAlert();
        }
      });
    }
				/* CHECK MINE TYPE */
    function checkMineType(dados) {
        var check = true;
        for(var i = 0; i < dados.length; i++) {
          if(settings.inputAccept.indexOf(dados[i].type) <= -1) {
            check = false;
            return;
          }
        }
        return check;
      }
			
				function openFile(a) {
				if (typeof settings.actionOpenFile == 'function') {
					settings.actionOpenFile.call(this, a);
				}
			}
			
			
    /* EVENTS */
    $document.on("click", ".btn-close-olform-success", function() {
      closeAlert();
    });
    $document.on("click", ".btn-close-olform-error", function() {
      closeAlert();
    });
    $document.on("click", "a.dir-navigator", function() {
      return getFilesAndFolders($(this).attr("data-folder"));
    });
			
				$document.on("click", "a.filed", function() {
     // return getFilesAndFolders($(this).attr("data-folder"));
					
					openFile($(this).attr("data-url"));
					
    });
			
    $document.on("click", "button[name=send-new-folder]", function(e) {
      e.preventDefault();
      e.stopPropagation();
      setFolder();
    });
    $(settings.areaDrop).on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }).on('dragover dragenter', function() {
      $(settings.areaDrop).addClass('is-dragover');
    }).on('dragleave dragend drop', function() {
      $(settings.areaDrop).removeClass('is-dragover');
    }).on('drop', function(e) {
      e.preventDefault();
      sendFiles(e);
    });
    init();
  }
}(jQuery));