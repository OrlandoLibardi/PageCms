/*!
	* OLForm - 1.0.1
	* PLUGIN EM JQUERY PARA AUTOMATIZAR O PROCESSO DE ENVIO DE FORMULÁRIOS PARA UM CONTROLLER EM LARAVEL.
	* @COPYRIGHT 2001-2019 ORLANDO LIBARDI
 * @AUTHOR 2001-2019 ORLANDO LIBARDI
	* IMPORTANT:
	*	1- O PLUGIN TRABALHA COM RETONOS EM JSON E ESPERA-SE UM ERRO DO TIPO 422 PARA TRATAMENTO DE ERROS E 201 PARA ENVIO CONCLUÍDO.
	* 2- O PLUGIN FOI PROJETADO PARA TRABALHAR EM LARAVEL 5.2 > E ESPERA ENCONTRAR UMA META CSRF-TOKEN OU UM INPUT TOKEN OU AINDA UM INPUT _TOKEN PARA ENVIAR O FORMULÁRIO POR AJAX
	* 3- O PLUGIN CONTA COM DEPENDÊNCIAS DE LAYOUT (VISUALIZAÇÃO) PARA BOOTSTRAP 3.7 E FONT AWESOME 4
!*/
(function($) {
	"use strict";
	$.fn.OLForm = function(options, callback) {
		var $el = $(this);
		var $document = $(document);
		var $body = $('body');
        var dataSuccess = false;
		var defaults = {
			'action': false,
			'method': false,
			'enctype': false,
			'token': false,
			'btn': '',
			'urlRetun' : '',
			'textSendding': 'Aguarde Carregando...',
			'btnSubmitText': 'ENVIAR',
			'btnSubmitClass': 'btn btn-primary',
			'btnCancelText': 'CANCELAR',
			'btnCancelClass': 'btn btn-warning pull-right',
			'listErrorPosition': '',
			'listErrorPositionBlock': ''
		};
		var settings = $.extend({}, defaults, options);

		function init() {
			setButtons();
			checkValues();
		}

		function setButtons() {
			if (!settings.btn) {
					var obj = '<div class="col-md-12">';
					obj += '<button class="' + settings.btnSubmitClass + '" type="submit">' + settings.btnSubmitText + '</button>';
					obj += '<a href="'+settings.urlRetun+'" class="' + settings.btnCancelClass + '">' + settings.btnCancelText + '</a>';
					obj += '</div>';
					$el.append(obj);
			}
		}

		function checkValues() {
			if (!settings.action) {
				settings.action = $el.attr("action");
				if (!settings.action) {
					console.error('OLFORM: ACTION não encontrada!');
                    return false;
				}
			}
			if (!settings.method) {
				settings.method = $el.attr('method').toUpperCase();
				if (!settings.method) {
					settings.method = 'POST';
				}
			}
			if (!settings.enctype) {
				settings.enctype = $el.attr("enctype");
				if (!settings.enctype) {
					settings.enctype = "multipart/form-data";
				}
			}
			if (!settings.token) {
				findToken();
			}

		}

		function findToken() {
			var token = ($("meta[name=csrf-token]")) ? $("meta[name=csrf-token]").attr("content") : false;
			token = (!token) ? $("input[name=_token]").val() : token;
			token = (!token) ? $("input[name=token]").val() : token;
			if (!token) {
				console.error('OLFORM: TOKEN e ou CSRF-TOKEN não encontrados!');
			}
			settings.token = token;
		}


		function send() {
				console.log("OLFROM SENDDING...");
				$(".olform-error-list").remove();
				$.ajaxSetup({
					headers: {
						'X-CSRF-TOKEN': settings.token
					}
				});

				$.ajax({
					data: $el.serialize(),
					method: settings.method,
					url: settings.action,
					beforeSend: function() {
						showAlert(settings.textSendding, 'loading');
					},
					success: function(exr) {
						//console.log(exr);
						showAlert(exr.message, exr.status);
                        if(typeof exr.data != 'undefined'){
                            dataSuccess = exr.data;
                        }
					},
					error: function(exr, sender) {
						if(typeof exr.responseJSON.errors != 'undefined'){
                            showErros(exr);
                        }
                        var status = exr.status;

                        if(typeof exr.responseJSON.status != 'undefined'){
                            status = exr.responseJSON.status;
                        }

						showAlert(exr.responseJSON.message, status);

					},
					complete: function() {

					},
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
			/*List error after comunication error*/
		function showErros(exr) {

				if (settings.listErrorPositionBlock) {
					var errors = "", i= 0;
					$.each(exr.responseJSON.errors, function(a, b) {
						if (b != undefined) {
							errors += "<p>" + eval(i + 1) + " - " + b + "</p>";
						}
					});

					var objErrors = '<div class="olform-error-list">';
					objErrors += '<div class="alert alert-danger">';
					objErrors += '<h3>' + exr.responseJSON.message + '</h3>';
					objErrors += errors;
					objErrors += '</div>';
					objErrors += '</div>';
					var $blockError = $(settings.listErrorPositionBlock);
					settings.listErrorPosition == 'after' ? $blockError.after(objErrors) : $blockError.before(objErrors);

				}

			}
			/*mesages*/
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
			}else if(status == 403){
                obj += '<span class="olform-icon-error"></span>';
				obj += '<p class="olform-title-load">';
				obj += 'Desculpe, você não tem permissão para fazer isso.<br />';
				obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
				obj += '</p>';
            }else{
                obj += '<span class="olform-icon-error"></span>';
				obj += '<p class="olform-title-load">';
				obj += msg+'<br />';
				obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
				obj += '</p>';
            }
			obj += '</div>';
			obj += '</div>';
			$body.append(obj);
		}

		/*events*/
		$el.on("submit", function(e) {
			e.preventDefault();
			e.stopPropagation();
			send();
		});
		$document.on("click", "#OLFORM-response .btn-close-olform-error", function() {
			$(".olform-response > div").fadeOut(300, function() {
				$(".olform-response").fadeOut(300, function() {
					$(".olform-response").remove();
					$(".olform-error-list").fadeIn(300);
				});
			});
		});
		$document.on("click", "#OLFORM-response .btn-close-olform-success", function() {
			$(".olform-response > div").fadeOut(300, function() {
				$(".olform-response").fadeOut(300, function() {
					$(".olform-response").remove();
					isCallback();
				});
			});
		});

		init();
	}
}(jQuery));
