/*!
	* OLForm - 1.0.1
	* PLUGIN EM JQUERY PARA AUTOMATIZAR O PROCESSO DE ENVIO DE FORMULÁRIOS PARA UM CONTROLLER EM LARAVEL.
	* @COPYRIGHT 2001-2019 ORLANDO LIBARDI
 	* @AUTHOR 2001-2019 ORLANDO LIBARDI
!*/
(function($) {
	"use strict";
	$.fn.OLComunication = function(options, callback) {
		var $el = $(this);
		var $document = $(document);
		var $body = $('body');
        var defaults = {
            'textSendding': 'Aguarde Carregando...',
			'textConfirm': 'Deseja EXCLUIR os registros selecionados?',
			'textConfirmButton': 'Sim, Excluir!',
			'textAbortButton': 'Não, Abortar!',
			'btnConfirmClass': 'btn btn-primary',
			'btnAbortClass': 'btn btn-default',
			'btnOpenDialogClass': 'btn btn-sm btn-danger',
		};
		var settings = $.extend({}, defaults, options);

		/*mesages*/
        this.showAlert = function (msg, status, callback) {
			$(".olform-response").remove();
			var obj = '<div class="olform-response" id="OLComunication-response">';
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
			}else if (status == 'confirm') {
				obj += '<span class="olform-icon-confirm"></span>';
				obj += '<p class="olform-title-load">';
				obj += msg + '<br />';
				obj += '<a href="javascript:;" class="btn-confirm ' + settings.btnConfirmClass + '">' + settings.textConfirmButton + '</a>'
				obj += '<a href="javascript:;" class="btn-abort ' + settings.btnAbortClass + '">' + settings.textAbortButton + '</a>';
				obj += '</p>';
			}
			obj += '</div>';
			obj += '</div>';
			$body.append(obj);

            this.callback = false;

            if (typeof callback == 'function') {
                this.callback = callback;
            }

		}
        /*Success after comunication success*/
        this.isCallback = function() {
            if (typeof this.callback == 'function') {
                this.callback.call(this);
            }
        }
        /* REMOVE THIS FEEDBACK */
        this.removeFeedback = function() {
            var $t = this;
                $(".olform-response > div").fadeOut(300, function() {
                    $(".olform-response").fadeOut(300, function() {
                        $(".olform-response").remove();
                        $t.isCallback();
                    });
                });
            }
		/*events*/
        $document.on("click", "#OLComunication-response .btn-abort", function() {
            $comunication.callback = false
			$comunication.removeFeedback();
		});
        $document.on("click", "#OLComunication-response .btn-confirm", function() {
			$comunication.removeFeedback();
		});
		$document.on("click", "#OLComunication-response .btn-close-olform-error", function() {
			$comunication.removeFeedback();
		});
		$document.on("click", "#OLComunication-response .btn-close-olform-success", function() {
			$comunication.removeFeedback();
		});

        return this;

	}
}(jQuery));
