(function($) {
    "use strict";
    $.fn.OLDropImages = function(options, callback) {
        var $el = $(this);
        var $document = $(document);
        var $body = $('body');
        var dataSuccess = false;
        var defaults = {
            actionSendFile: '',
            methodSendFile: 'POST',
            inputSendName: 'file',
            inputAccept: 'image/jpeg,image/png,image/gif',
            areaDrop: '#OLFiles-dropzone',
            token: false,
            textSendding: 'Aguarde Carregando...',
            name: "libardi-drop-and-drag-" + Math.random(),
            extraParamName  : '',
            extraParamValue : '',
        };
        var settings = $.extend({}, defaults, options);

        function init() {
            settings.inputAccept = settings.inputAccept.replace(/ /g, "").split(",");
            checkValues();
            initFormFiles();
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
            $(settings.areaDrop).html(obj);
        }

        /*CHECK VALUES*/
        function checkValues() {
                /* ACTIONS */
                if (!settings.actionSendFile) throw new Error("OLFiles: ACTION SEND FILE não encontrada!");
                /* AREAS */
                if (!$(settings.areaDrop)) throw new Error("OLFiles: DROP AREA não encontrada!");
                /* TOKEN */
                if (!settings.token) findToken();
            }
            /*FIND TOKEN*/
        function findToken() {
                var token = ($("meta[name=csrf-token]")) ? $("meta[name=csrf-token]").attr("content") : false;
                token = (!token) ? $("input[name=_token]").val() : token;
                token = (!token) ? $("input[name=token]").val() : token;
                if (!token) throw new Error('OLFiles: TOKEN e ou CSRF-TOKEN não encontrados!');
                settings.token = token;
            }
            /*List error after comunication error*/
        function showErros(exr) {
                if (settings.listErrorPositionBlock) {
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
                if (status == 'success') {
                    obj += '<span class="olform-icon-success"></span>';
                    obj += '<p class="olform-title-load">';
                    obj += msg + '<br />';
                    obj += '<a href="javascript:;" class="btn-close-olform-success btn btn-primary text-uppercase">Fechar</a>';
                    obj += '</p>';
                } else if (status == 'loading') {
                    obj += '<span class="olform-icon-load"></span>';
                    obj += '<p class="olform-title-load">';
                    obj += msg;
                    obj += '</p>';
                } else if (status == 'error') {
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
                console.log("Enviar");
                if ($(settings.areaDrop).hasClass("active")) return false;
                var progress = '<div id="dropDropProgreess"><div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>';
                //$(settings.areaDrop).after(progress);
                var $form = $('form[name="' + settings.name + '"]'),
                    $input = $('input[type="file"]'),
                    droppedFiles = e.originalEvent.dataTransfer.files,
                    fileInput = document.getElementById('the-file'),
                    ajaxData = new FormData($form.get(0));
                if (!checkMineType(droppedFiles)) {
                    showAlert('Você não pode enviar esse tipo de arquivos.', "error");
                    return false;
                }
                $(settings.areaDrop).addClass('active');

                ajaxData.append(settings.extraParamName, settings.extraParamValue);

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
                        if (window.ActiveXObject) {
                            jqXHR = new window.ActiveXObject("Microsoft.XMLHTTP");
                        } else {
                            jqXHR = new window.XMLHttpRequest();
                        }
                        //Upload progress
                        jqXHR.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = Math.round((evt.loaded * 100) / evt.total);
                            }
                        }, false);
                        return jqXHR;
                    },
                    beforeSend: function() {
                        console.log("Enviando");
                        showAlert(settings.textSendding, 'loading');
                    },
                    success: function(exr) {
                        console.log("success", exr);
                        $(settings.areaDrop).removeClass('active');
                        $input.val("");
                        if(typeof exr.data != 'undefined'){
                            dataSuccess = exr.data;
                        }
                        isCallback();
                    },
                    error: function(exr) {
                        console.log("error", exr);
                        $(settings.areaDrop).removeClass('active');
                        $input.val("");
                        showAlert(exr.responseJSON.message, 'error');
                    },
                    complete: function(exr) {
                        console.log("enviado");
                        closeAlert();
                    }
                });
            }
            /*Success after comunication success*/
    		function isCallback() {
        		if (typeof callback == 'function') {
        			callback.call(this, dataSuccess);
        		}
        		else {
        			window.location ="" + settings.urlRetun + "";
        		}
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
