(function($) {
    "use strict";
    $.fn.OLFiles = function(options, callback) {
        var $el = $(this);
        var $document = $(document);
        var $body = $("body");
        var defaults = {
            actionListFolders: "",
            methodListFolders: "GET",
            actionCreateFolder: "",
            methodCreateFolder: "POST",
            actionOpenFile: "",
            methodOpenFile: "GET",
            actionSendFile: "",
            methodSendFile: "POST",
            inputSendName: "file",
												inputAccept:'image/jpeg,image/png,image/gif',
            areaDrop: "#OLFiles-dropzone",
            areaListFiles: "#OLFiles-list-files",
            areaListDirs: "#OLFiles-list-dir",
            areaFormFolder: "#OLFiles-form-folder",
            token: false,
            initialFolder: "",
            textSendding: "Aguarde Carregando...",
            btnSubmitText: "ENVIAR",
            btnSubmitClass: "btn btn-primary",
            btnCancelText: "CANCELAR",
            btnCancelClass: "btn btn-danger pull-right",
            listErrorPosition: "after",
            listErrorPositionBlock: ".page-heading",
            name: "libardi-drop-and-drag-" + Math.random()
        };
        var settings = $.extend({}, defaults, options);
								
        function init() {
												settings.inputAccept = settings.inputAccept.replace(/ /g,"").split(",");	
            checkValues();
            getFilesAndFolders(settings.initialFolder);
            initFromFolder(settings.initialFolder);
            initFormFiles();
        }
        function initListFolders(a) {
            var b = "";
            $.each(a, function(a, c) {
                b += '<div class="file-box">';
                b += '<div class="file">';
                b += '<a href="javascript:;" data-folder="' + c.path + '"  class="dir-navigator">';
                b += '<div class="icon">';
                b += '<i class="fa fa-folder"></i>';
                b += "</div>";
                b += '<div class="file-name">';
                b += "<p>" + c.name + "</p>";
                b += "<small>" + c.time + "</small>";
                b += "</div>";
                b += "</a>";
                b += "</div>";
                b += "</div>";
            });
            return b;
        }
								function checkMineType(a) {
													var b = true;
													for (var c = 0; c < a.length; c++) if (settings.inputAccept.indexOf(a[c].type) <= -1) {
																	console.log("type", settings.inputAccept, a[c].type);
																	b = false;
																	return;
													}
													return b;
									}
        function initListFiles(a) {
            var b = "";
            $.each(a, function(a, c) {
                b += '<div class="file-box">';
                b += '<div class="file">';
                b += '<a href="javascript:;" data-folder="' + c.realname + '" data-extension="' + c.size + '" data-url="' + c.url + '">';
                b += '<div class="image">';
                b += '<img src="' + c.url + '" class="img-responsive center-block">';
                b += "</div>";
                b += '<div class="file-name">';
                b += "<p>" + c.name + "." + c.extension + "</p>";
                b += "<small>" + c.time + "</small>";
                b += "</div>";
                b += "</a>";
                b += "</div>";
                b += "</div>";
            });
            return b;
        }
        function initFromFolder(a) {
            var b = '<form name="create-folder" id="create-folder" onSubmit="return false">';
            b += '<input type="hidden" name="base_path" value="' + a + '">';
            b += '<div class="input-group input-group-sm">';
            b += '<input name="name" type="text" class="form-control" placeholder="Nova Pasta...">';
            b += '<span class="input-group-btn">';
            b += '<button class="btn btn-default btn-folder" type="button" name="send-new-folder">OK</button>';
            b += "</span>";
            b += "</div>";
            b += "</form>";
            $(settings.areaFormFolder).html(b);
        }
        function initBreadcrumbs(folder) {
            var f = folder.split("/"), total = f.length, tempfolder = "", obj = '<ol class="breadcrumb">';
            for (var key in f) if (0 == key) {
                tempfolder += f[key];
                obj += '<li> <a href="javascript:;" class="dir-navigator" data-folder="' + tempfolder + '"><i class="fa fa-home"></i></a> </li>';
            } else {
                tempfolder += "/" + f[key];
                if (eval(parseInt(key) + 1) == total) obj += '<li class="active">' + f[key] + "</li>"; else obj += '<li><a href="javascript:;" class="dir-navigator" data-folder="' + tempfolder + '">' + f[key] + "</a></li>";
            }
            obj += "</ol>";
            return obj;
        }
        function getFilesAndFolders(a) {
            $(".olform-error-list").remove();
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": settings.token
                }
            });
            $.ajax({
                data: {
                    directory: a
                },
                method: settings.methodListFolders,
                url: settings.actionListFolders,
                beforeSend: function() {
                    showAlert(settings.textSendding, "loading");
                },
                success: function(a) {
                    var b = initListFolders(a.directories);
                    b += initListFiles(a.files);
                    $(settings.areaListFiles).html(b);
                    $(settings.areaListDirs).html(initBreadcrumbs(a.directory));
                    $("#create-folder input[name=base_path]").val(a.directory);
                    closeAlert();
                },
                error: function(a, b) {
                    showAlert(a.responseJSON.message, a.responseJSON.status);
                },
                complete: function() {
                    
                }
            });
        }
        function setFolder() {
            $(".olform-error-list").remove();
            $.ajaxSetup({
                headers: {
                    "X-CSRF-TOKEN": settings.token
                }
            });
            $.ajax({
                data: $("#create-folder").serialize(),
                method: settings.methodCreateFolder,
                url: settings.actionCreateFolder,
                beforeSend: function() {
                    showAlert(settings.textSendding, "loading");
                },
                success: function(a) {
                    var b = $("#create-folder input[name=base_path]").val() + "/" + $("#create-folder input[name=name]").val();
                    getFilesAndFolders(b);
                    $("#create-folder input[name=name]").val("");
                    getFiles(b);
                },
                error: function(a, b) {
                    showAlert(a.responseJSON.message, a.responseJSON.status);
                },
                complete: function() {
                   
                }
            });
        }
        function initFormFiles() {
            var a = '<form action="' + settings.actionSendFile + '" ';
            a += 'name="' + settings.name + '" ';
            a += 'method="' + settings.methodSendFile + '" ';
            a += 'enctype="multipart/form-data">';
            a += '<input id="the-file" type="file" class="do-not-clean" ';
            a += 'name="' + settings.inputSendName;
            a += '[]" ';
            a += "multiples ";
            a += 'accept="image" ';
            a += 'style="visibility: hidden; height: 0px; width: 0px;"> ';
            a += "</form>";
            a += '<ul class="list-files"> </ul>';
            $(settings.areaDrop).html(a);
        }
        function showAlert(a, b) {
            $(".olform-response").remove();
            var c = '<div class="olform-response" id="OLFORM-response">';
            c += "<div>";
            if ("success" == b) {

                c += '<span class="olform-icon-success"></span>';
                c += '<p class="olform-title-load">';
                c += a + "<br />";
                c += '<a href="javascript:;" class="btn-close-olform-success btn btn-primary text-uppercase">Fechar</a>';
                c += "</p>";
            } else if ("loading" == b) {
                c += '<span class="olform-icon-load"></span>';
                c += '<p class="olform-title-load">';
                c += a;
                c += "</p>";
            } else if ("error" == b) {
                c += '<span class="olform-icon-error"></span>';
                c += '<p class="olform-title-load">';
                c += a + "<br />";
                c += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
                c += "</p>";
            }
            c += "</div>";
            c += "</div>";
            $body.append(c);
        }
        function checkValues() {
            if (!settings.actionListFolders) throw new Error("OLFiles: ACTION LIST FOLDER não encontrada!");
            if (!settings.actionCreateFolder) throw new Error("OLFiles: ACTION CREATE FOLDER não encontrada!");
            if (!settings.actionOpenFile) throw new Error("OLFiles: ACTION OPEN FILE não encontrada!");
            if (!settings.actionSendFile) throw new Error("OLFiles: ACTION SEND FILE não encontrada!");
            if (!settings.initialFolder) throw new Error("OLFiles: INITIAL FOLDER não configurada!");
            if (!$(settings.areaDrop)) throw new Error("OLFiles: DROP AREA não encontrada!");
            if (!$(settings.areaListFiles)) throw new Error("OLFiles: LIST FILES AREA não encontrada!");
            if (!$(settings.areaListDirs)) throw new Error("OLFiles: LIST DIRECTORIES AREA não encontrada!");
            if (!$(settings.areaFormFolder)) throw new Error("OLFiles: FORM FOLDER AREA não encontrada!");
            if (!settings.token) findToken();
												
												
												
        }
        function findToken() {
            var a = $("meta[name=csrf-token]") ? $("meta[name=csrf-token]").attr("content") : false;
            a = !a ? $("input[name=_token]").val() : a;
            a = !a ? $("input[name=token]").val() : a;
            if (!a) throw new Error("OLFiles: TOKEN e ou CSRF-TOKEN não encontrados!");
            settings.token = a;
        }
        function showErros(exr) {
            if (settings.listErrorPositionBlock) {
                var errors = "";
                $.each(exr.responseJSON.errors, function(a, b) {
                    if (void 0 != b) errors += "<p>" + eval(a + 1) + " - " + b + "</p>";
                });
                var objErrors = '<div class="olform-error-list">';
                objErrors += '<div class="alert alert-danger">';
                objErrors += "<h3>" + exr.responseJSON.message + "</h3>";
                objErrors += errors;
                objErrors += "</div>";
                objErrors += "</div>";
                var $blockError = $(settings.listErrorPositionBlock);
                "after" == settings.listErrorPosition ? $blockError.after(objErrors) : $blockError.before(objErrors);
            }
        }
        function showAlert(a, b) {
            $(".olform-response").remove();
            var c = '<div class="olform-response" id="OLFORM-response">';
            c += "<div>";
            if ("success" == b) {
                c += '<span class="olform-icon-success"></span>';
                c += '<p class="olform-title-load">';
                c += a + "<br />";
                c += '<a href="javascript:;" class="btn-close-olform-success btn btn-primary text-uppercase">Fechar</a>';
                c += "</p>";
            } else if ("loading" == b) {
                c += '<span class="olform-icon-load"></span>';
                c += '<p class="olform-title-load">';
                c += a;
                c += "</p>";
            } else if ("error" == b) {
                c += '<span class="olform-icon-error"></span>';
                c += '<p class="olform-title-load">';
                c += a + "<br />";
                c += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
                c += "</p>";
            }
            c += "</div>";
            c += "</div>";
            $body.append(c);
        }
        function closeAlert() {
            $(".olform-response > div").fadeOut(300, function() {
                $(".olform-response").fadeOut(300, function() {
                    $(".olform-response").remove();
                });
            });
        }
        function sendFiles(a) {
            if ($(settings.areaDrop).hasClass("active")) return false;            
            
            var c = $('form[name="' + settings.name + '"]'), d = $('input[type="file"]'), e = a.originalEvent.dataTransfer.files, f = document.getElementById("the-file"), g = $("input[name=base_path]").val(), h = new FormData(c.get(0));
									
												if(!checkMineType(e)){ showAlert('Você não pode enviar esse tipo de arquivos.', "error"); return false;}
												
												$(settings.areaDrop).addClass("active");
									
            h.append("dir", g);
            if (e) Array.prototype.forEach.call(e, function(a) {
                h.append("file[]", a);
            });
            $.ajax({
                url: c.attr("action"),
                type: c.attr("method"),
                data: h,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                async: true,
                xhr: function() {
                    var a = null;
                    if (window.ActiveXObject) a = new window.ActiveXObject("Microsoft.XMLHTTP"); else a = new window.XMLHttpRequest();
                    a.upload.addEventListener("progress", function(a) {
                        if (a.lengthComputable) {
                            var b = Math.round(100 * a.loaded / a.total);
                        }
                    }, false);
                    return a;
                },
                beforeSend: function() {
                    showAlert(settings.textSendding, "loading");
                },
                success: function(a) {
                    getFilesAndFolders(g);
                    $(settings.areaDrop).removeClass("active");
                    d.val("");
                },
                error: function(a) {
                    $(settings.areaDrop).removeClass("active");
                    d.val("");
                    showAlert(a.responseJSON.message, "error");
                },
                complete: function(a) {
                    closeAlert();
                }
            });
        }
        $document.on("click", ".btn-close-olform-success", function() {
          closeAlert();
        });
								$document.on("click", ".btn-close-olform-error", function() {
										closeAlert();
								});
        $document.on("click", "a.dir-navigator", function() {
            return getFilesAndFolders($(this).attr("data-folder"));
        });
        $document.on("click", "button[name=send-new-folder]", function(a) {
            a.preventDefault();
            a.stopPropagation();
            setFolder();
        });
        $(settings.areaDrop).on("drag dragstart dragend dragover dragenter dragleave drop", function(a) {
            a.preventDefault();
            a.stopPropagation();
        }).on("dragover dragenter", function() {
            $(settings.areaDrop).addClass("is-dragover");
        }).on("dragleave dragend drop", function() {
            $(settings.areaDrop).removeClass("is-dragover");
        }).on("drop", function(a) {
            a.preventDefault();
            sendFiles(a);
        });
        init();
    };
}(jQuery));