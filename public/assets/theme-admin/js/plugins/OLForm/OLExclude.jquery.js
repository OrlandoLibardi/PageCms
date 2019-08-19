/*!
	* OLExclude - 1.0.1
	* PLUGIN EM JQUERY PARA AUTOMATIZAR O PROCESSO DELETE UM CONTROLADOR EM LARAVEL.
	* @COPYRIGHT 2001-2019 ORLANDO LIBARDI
 * @AUTHOR 2001-2019 ORLANDO LIBARDI
	* IMPORTANT:
	*	1- O PLUGIN TRABALHA COM RETONOS EM JSON E ESPERA-SE UM ERRO DO TIPO 422 PARA TRATAMENTO DE ERROS E 201 PARA ENVIO CONCLUÍDO.
	* 2- O PLUGIN FOI PROJETADO PARA TRABALHAR EM LARAVEL 5.2 > E ESPERA ENCONTRAR UMA META CSRF-TOKEN OU UM INPUT TOKEN OU AINDA UM INPUT _TOKEN PARA ENVIAR O FORMULÁRIO POR AJAX
	* 3- O PLUGIN CONTA COM DEPENDÊNCIAS DE LAYOUT (VISUALIZAÇÃO) PARA OLForm 1.0.0
!*/
(function($) {
	"use strict";
	$.fn.OLExclude = function(options, callback) {

		var $el = $(this);
		var $document = $(document);
		var $body = $('body');
		var defaults = {
			'action': '',
			'method': 'DELETE',
			'token': false,
			'inputCheckName': '',
			'inputCheckAll': '',
			'textSendding': 'Aguarde Carregando...',
			'textConfirm': 'Deseja EXCLUIR os registros selecionados?',
			'textConfirmButton': 'Sim, Excluir!',
			'textAbortButton': 'Não, Abortar!',
			'btnConfirmClass': 'btn btn-primary',
			'btnAbortClass': 'btn btn-default',
			'btnOpenDialogClass': 'btn btn-sm btn-danger',
		};

		var settings = $.extend({}, defaults, options);
		/*INITIALIZE THE PLUGIN DEPENDENCIES AND BUTTONS*/
		function init() {

				checkValues();
				$el.after('<button type="button" class="' + settings.btnOpenDialogClass + ' btn-open-exclude" disabled="disabled"> Excluir Selecionados?</button>');

			}
			/*CHECK FOR VALUES THE INPUTS, REQUIRED FOR SUBMIT*/
		function checkValues() {

				if (!settings.action) {
					console.error('OLExclude: ACTION não informada!');
				}

				if (!settings.inputCheckName || findInputCheckBox(settings.inputCheckName) == 0) {
					console.error('OLExclude: INPUT CHECK não informado ou não encontrado!');
				}

				if (!settings.inputCheckAll || findInputCheckBox(settings.inputCheckAll) == 0) {
					console.error('OLExclude: INPUT CHECK ALL não informado ou não encontrado!');
				}

				if (!settings.token) {
					findToken();
				}

			}
			/*FIND THE CHECKBOX INPUTS*/
		function findInputCheckBox(input) {

				var t = 0;
				$body.find("input[type=checkbox][name=" + input + "]").each(function() {
					t++;
				});
				return t;

			}
			/*FIND THE TOKEN OR CSRF-TOKEN*/
		function findToken() {

				var token = ($("meta[name=csrf-token]")) ? $("meta[name=csrf-token]").attr("content") : false;
				token = (!token) ? $("input[name=_token]").val() : token;
				token = (!token) ? $("input[name=token]").val() : token;

				if (!token) {
					console.error('OLExclude: TOKEN e ou CSRF-TOKEN não informado ou não encontrado!');
				}

				settings.token = token;

			}
			/*CHECK OR DESCHECK ALL INPUTS */
		function checkAll(type) {

				$body.find("input[type=checkbox][name=" + settings.inputCheckName + "]").each(function() {

					$(this).prop('checked', type);

					if (type) {
						$(this).parent().parent().addClass("olform-bg-red");
					}
					else {
						$(this).parent().parent().removeClass("olform-bg-red");
					}

				});

				btnToogle();

			}
			/*CONFIRM ELEMENTS AND HANDLE THE BUTTON OPEN DIALOGUES*/
		function btnToogle() {

				var t = 0;
				$body.find("input[type=checkbox][name=" + settings.inputCheckName + "]").each(function() {

					if ($(this).is(':checked')) {
						t++;
					}

				});

				if (t > 0) {
					$(".btn-open-exclude").removeAttr("disabled");
					return;
				}

				$(".btn-open-exclude").attr("disabled", "disabled");
				$("input[type=checkbox][name=" + settings.inputCheckAll + "]").prop('checked', false);

			}
			/* SHOW MESSAGES FOR DIALOGS */
		function showAlert(msg, status) {
			$(".olform-response").remove();
			var obj = '<div class="olform-response" id="OLEXCLUDE-response">';
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
			}
			else if (status == 'confirm') {
				obj += '<span class="olform-icon-confirm"></span>';
				obj += '<p class="olform-title-load">';
				obj += msg + '<br />';
				obj += '<a href="javascript:;" class="btn-confirm ' + settings.btnConfirmClass + '">' + settings.textConfirmButton + '</a>'
				obj += '<a href="javascript:;" class="btn-abort ' + settings.btnAbortClass + '">' + settings.textAbortButton + '</a>';
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
				obj += message+'<br />';
				obj += '<a href="javascript:;" class="btn-close-olform-error btn btn-danger text-uppercase">Ok, entendi.</a>';
				obj += '</p>';
            }
			obj += '</div>';
			obj += '</div>';
			$body.append(obj);
		}

		/*CALLBACK AFTER COMMUNICATION SUCCESS CASE*/

		function excludeCallback() {
				if (typeof callback == 'function') {
					callback.call(this);
				}
				else {
					reset();
				}
			}
			/* REMOVE THIS FEEDBACK */
		function removeFeedback() {
				$(".olform-response > div").fadeOut(300, function() {
					$(".olform-response").fadeOut(300, function() {
						$(".olform-response").remove();

					});
				});
			}
			/* SEND */
		function send() {
			$.ajaxSetup({
				headers: {
					'X-CSRF-TOKEN': settings.token
				}
			});
			var ids = [];
			$document.find("input[type=checkbox][name=" + settings.inputCheckName + "]:checked").each(function() {
				ids.push($(this).val());
			});
			ids = JSON.stringify(ids);
			$.ajax({
				data: {
					'id': ids
				},
				method: settings.method,
				url: settings.action,
				beforeSend: function() {
					showAlert(settings.textSendding, 'loading');
				},
				success: function(exr) {
					console.log(exr);
					showAlert(exr.message, exr.status);
				},
				error: function(exr, sender) {
					console.log(exr);
					//showAlert(exr.responseJSON.message, exr.responseJSON.status);

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

		/*RESET INPUTS AND RESTART DEFAULT ACTION BUTTON SHOW DIALOG */
		function reset() {
			$("input[type=checkbox][name=" + settings.inputCheckName + "], input[type=checkbox][name=" + settings.inputCheckAll + "]").prop('checked', false);
			$("tr").removeClass("olform-bg-red");
			$(".btn-open-exclude").attr("disabled", "disabled");
		}


		/* EVENTS REGISTERS */
		$document.on("click", "input[type=checkbox][name=" + settings.inputCheckAll + "]", function() {

			var type = false;

			if ($(this).is(':checked')) {
				type = true;
			}

			checkAll(type);

		});

		$document.on("click", "input[type=checkbox][name=" + settings.inputCheckName + "]", function() {

			if ($(this).is(':checked')) {
				$(this).parent().parent().addClass("olform-bg-red");
			}
			else {
				$(this).parent().parent().removeClass("olform-bg-red");
			}

			btnToogle();

		});

		$document.on("click", ".btn-open-exclude", function() {

			showAlert(settings.textConfirm, 'confirm');

		});

		$document.on("click", "#OLEXCLUDE-response .btn-confirm", function() {

			removeFeedback();

			setTimeout(function() {
				send();
			}, 700);

		});

		$document.on("click", "#OLEXCLUDE-response .btn-close-olform-success", function() {
			$(".olform-response > div").fadeOut(300, function() {
				$(".olform-response").fadeOut(300, function() {
					$(".olform-response").remove();
					console.log("call excludeCallback");
					$(".olform-bg-red").fadeOut(300, function() {
						excludeCallback();
						$(this).remove();
					});
					/*$(".olform-bg-red").remove();*/
				});
			});
		});


		$document.on("click", "#OLEXCLUDE-response .btn-abort, #OLEXCLUDE-response .btn-close-olform-error", function() {

			reset();

			removeFeedback();

		});

		init();

	}
}(jQuery));
