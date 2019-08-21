// o ponto e vírgula antes da invocação da função é uma segurança
// net contra scripts concatenados e / ou outros plugins
// que não estão fechados corretamente.
;(function ( $, window, document, undefined ) {
 
    
    // undefined é usado aqui como o global indefinido
    // variável no ECMAScript 3 e é mutável (isto é, pode
    // ser alterado por outra pessoa). indefinido não é realmente
    // sendo passado para que possamos garantir que seu valor seja
    // verdadeiramente indefinido. No ES5, undefined não pode mais ser
    // modificado.
 
    // janela e documento são passados como locais
    // variáveis em vez de globais, porque isso (levemente)
    // acelera o processo de resolução e pode ser mais
    // eficientemente minificado (especialmente quando ambos são
    // regularmente referenciado em nosso plugin).
 
    // Cria os padrões uma vez
    var pluginName = "defaultPluginName",
        
								defaults = {
											'action': "",
											'method': "",
											'enctype': "multipart/form-data",
											'name': "",
											'token' : "",
											'btn' : "",
											'btnText' : "",
											'btnSendding' : 'Aguarde Carregando...'
							};
 
    // O construtor do plugin atual
    function Plugin( element, options ) {
        this.element = element;
					   this.$element = $(this.element);
 							defaults.action = this.$element.attr("action");
								defaults.method = this.$element.attr("method");
							 defaults.enctype = this.$element.attr("enctype");
        // jQuery tem um método extend que mescla o
        // conteúdo de dois ou mais objetos, armazenando o
        // resulta no primeiro objeto. O primeiro objeto
        // está geralmente vazio porque não queremos alterar
        // as opções padrão para futuras instâncias do plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
 
        this.init();
    }
 			/*
    Plugin.prototype.init = function () {
        // Coloque a lógica de inicialização aqui
        // Já temos acesso ao elemento DOM e
        // as opções através da instância, por ex. this.element
        // e this.options
							console.log(this.options.propertyName);
							console.log(Plugin.prototype.action());
					  
    };
				
				Plugin.prototype.action = function(){
					alert(this.options.propertyName);
				}*/
	
				Plugin.prototype = {
						init : function(){
							
							
							$(this.element).addClass("my-form");
							
							//	console.log(this.options);
							/*	$(this.element).on("submit", function(){
										alert("ola");
								});
								e.currentTarget.getAttribute("id")
							*/
								
						},
						action : function(){
							console.log('actions', this.options );
						},
						registerEvent : function(){
							
						}
					
				}
 
    // Um  invólucro de plugins muito leve ao redor do construtor,
    // prevenindo contra instanciações múltiplas
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }
				
				//$.fn[pluginName] = 'plugin_'+pluginName._jQueryInterface;
 
})( jQuery, window, document );
	
$(document).on('submit', ".my-form", function (event) {    
				event.preventDefault();
				console.log("chegou aqui");
    var $trigger = $(this);
    var selector = "form";
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
					var $target = $(this);
					var data = $target.data('plugin_defaultPluginName');
					if(data){
						console.log(data);
						console.log(data.options);
						//$("#form").defaultPluginName(data.options).action();
						plugin_defaultPluginName.action($target, data);
					}
					//.data('plugin_defaultPluginName.options')
      /*var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      defaultPluginName._jQueryInterface.call($target, config);*/
    });
  });
 $("#form").defaultPluginName({ propertyName: "a custom value" });