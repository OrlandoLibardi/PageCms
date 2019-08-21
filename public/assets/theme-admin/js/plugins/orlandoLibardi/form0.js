// JavaScript Document

if (typeof jQuery === 'undefined') {
  throw new Error('Orlando Forms\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Orlando Form\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

+function ($) {
  'use strict';
	
	// OLForm CLASS DEFINITION
 // ======================

  var OLForm = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)			
  }
		
		OLForm.VERSION  = '1.0.0'

  OLForm.DEFAULTS = {
    action: "",
    method: "",
    enctype: "",
			 csrfToken : "",
			 btn : "",
			 btnText : "Enviar",
			 btnSedding : "Aguarde Carregando..."
  }
	
	 OLForm.prototype.init = function(){
			
			this.$element.addClass("OLForm");
			this.options.csrfToken = $("meta[name=csrf-token]").attr("content");
			this.options.method = this.$element.attr("method");
			this.options.enctype = this.$element.attr("enctype");
			console.log("init");
		}
		
		OLForm.prototype.show = function(){
			
			console.log("show", this.options);
			
		}
		
		// OLForm PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('OLForm')
      var options = $.extend({}, OLForm.DEFAULTS, $this.data(), typeof option == 'object' && option)
						//data.show;
    })
  }

  var old = $.fn.OLForm

  $.fn.OLForm             = Plugin
  $.fn.OLForm.Constructor = OLForm
	
	
		// OLForm NO CONFLICT
  // =================

  $.fn.OLForm.noConflict = function () {
    $.fn.OLForm = old
    return this
  }
		
		// OLForm DATA-API
  // ==============

  $(document).on('submit', '.OLForm', function (e) {
				e.preventDefault();
			 console.log("enviando...");
			 var $this   = $(this);
			 var option = $(this).data('OLForm');
				Plugin.call(option)
    /*var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)*/
  })
		
}(jQuery);