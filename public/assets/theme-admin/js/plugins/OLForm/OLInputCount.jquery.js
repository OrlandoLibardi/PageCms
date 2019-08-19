/*!
	* OLForm - 1.0.1
	* PLUGIN EM JQUERY.
	* @COPYRIGHT 2001-2019 ORLANDO LIBARDI
    * @AUTHOR 2001-2019 ORLANDO LIBARDI
    * */
(function($) {
	"use strict";
	$.fn.OLInputCount = function(options, callback) {
		var $el = $(this);
		var $document = $(document);
		var $body = $('body');
        var dataSuccess = false;
        var id = Math.floor((Math.random() * 100) + 1);
        var min = '00';
        var defaults = {
            'max': false,
            'greenCollor' : '#1ab394',
            'redCollor' : '#ed5565',
            'inside' : false        
		};
		var settings = $.extend({}, defaults, options);

		function init() {
            $el.attr("maxlength", settings.max)
               .attr("data-countable", id);

            if(settings.inside === false){
                $el.after( show() );   
            }else{
                $(settings.inside).append( show() );
            }

                       
        }
        

        function show(){
            return '<div id="count-'+id+'" style="display:inline-block; float:right;">' + 
                   '<span id="total-'+id+'">'+min+'</span> / <span id="max-'+id+'">'+settings.max+'</span>' +
                   '</div>';
        }

        function update(id, value){
            var i = parseInt(value.length);            
            if(i > settings.max){
                return false;
            }
            var min = ( i < 10 ) ? '0' + i : i;
            var collor = ( i < settings.max ) ? settings.greenCollor : settings.redCollor;
            $('#total-'+id).css('color', collor).html(min);
        }
		/*events*/
		$(document).on("keypress", "*[data-countable]", function(){
            update($(this).attr('data-countable'), $(this).val());
        });

        $(document).on("focusout", "*[data-countable]", function(){
            update($(this).attr('data-countable'), $(this).val());
        });


        $document.ready(function(){
            update($el.attr('data-countable'), $el.val());
        });

		init();
	}
}(jQuery));
