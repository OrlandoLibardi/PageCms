$(document).ready(function () {
       $("#form").OLForm({}, showMensagem );
    });

    (function ($) {
        "use strict";
        $.fn.OLForm = function (options, response, callback) {
            var $el = $(this);
            var defaults = {
                'action': $el.attr("action"),
                'method': $el.attr("method"),
                'enctype': "multipart/form-data",
                'name': "ol-form-" + Math.random(),
                'token' : false,
																'btn' : '',
													   'btnText' : '',
													   'btnSendding' : 'Aguarde Carregando...'
            };

            var settings = $.extend( {}, defaults, options );

            this.init = function(){
                //$el.attr("onSubmit", 'return false');
																$el.addClass('my-form');
																this.checkActions();
                //console.log(settings);
            }
													
            this.checkActions = function(){
                
                settings.token = $("meta[name=csrf-token]").attr("content");

                $el.find("input").each(function(){
                    if($(this).attr("name") == 'method'){
                        settings.method = $(this).val();
                    }else if($(this).attr("name") == '_token'){
                        settings.token = $(this).val();
                    }
                });
													   var encontrado = false;
																$el.find("button[type=submit]").each(function(){
																		settings.btn = $(this).attr("name");
																		settings.btnText = $(this).html();	
																	 encontrado = true;	
																});
																if(!encontrado){
																	console.log("Error")
																}

            }

            this.sendForm = function(){
															
													  console.log(settings);
													
															
            }
												
												
												//document.addEventListener('wheel', scrollme);
									/*
            $el.on("submit", function(e){
													e.preventDefault();
													e.stopPropagation();
													var $btn = $("button[name="+settings.btn+"]");
													$btn.html(settings.btnSendding);
													$.ajaxSetup({ headers: { 'X-CSRF-TOKEN': settings.token } });
													$.ajax({
																	data: $el.serialize(),
																	method: 'POST',
																	url: settings.action,
																	complete: function(){
																		$btn.html(settings.btnText);
																	},
																	success: function(exr) {
																			if( typeof callback  == 'function'){
																					console.log('callback');
																			}
																				
																				console.log(exr);
																	},
														
																	error: function(exr, sender) {
																					if( typeof callback  == 'function'){
																							console.log('callback');
																					}
																					console.log(exr);
																					
																	}
													});
												});*/
												
														/*if( typeof callback  == 'function'){
																
														}*/

												//console.log(this);
this.init();
            //return 

        };
    }(jQuery));

	$(document).on('submit', ".my-form", function (event) {    
			event.preventDefault();
			console.log("chegou aqui");
			var $trigger = $(this);
			var selector = "form";
			var selectors = [].slice.call(document.querySelectorAll(selector));
			$(selectors).each(function () {
				var $target = $(this);
				var data = $target.data();
				if(data){
					console.log(data);
					console.log(data.options);
					//$("#form").defaultPluginName(data.options).action();
					//plugin_defaultPluginName.action($target, data);
				}
				//.data('plugin_defaultPluginName.options')
					/*var $target = $(this);
					var data = $target.data(DATA_KEY$3);
					var config = data ? 'toggle' : $trigger.data();

					defaultPluginName._jQueryInterface.call($target, config);*/
			});
	});
	
			function showMensagem(a){
				
			}