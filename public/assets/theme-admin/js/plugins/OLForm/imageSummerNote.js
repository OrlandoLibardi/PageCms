/**
 * 
 * copyright [year] [your Business Name and/or Your Name].
 * email: your@email.com
 * license: Your chosen license, or link to a license file.
 * 
 */
(function (factory) {
  /* Global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
/**
 * @class plugin.olImagePlugin
 *
 * example Plugin
*/
$.extend($.summernote.plugins, {
    /**
     *  @param {Object} context - context object has status of editor.
     */
    'olImagePlugin':function (context) {
        var self      = this,
         // ui has renders to build ui elements
         // for e.g. you can create a button with 'ui.button'
          ui        = $.summernote.ui,
          $note     = context.layoutInfo.note,
          // contentEditable element
          $editor   = context.layoutInfo.editor,
          $editable = context.layoutInfo.editable,
          $toolbar  = context.layoutInfo.toolbar,          
          // options holds the Options Information from Summernote and what we extended above.
          options   = context.options,          
          // lang holds the Language Information from Summernote and what we extended above.
          lang      = '';//options.langInfo;

      context.memo('button.olImagePlugin', function () {
        // Here we create a button
        var button = ui.button({
          // icon for button
          contents: options.olImagePlugin.icon,
          // tooltip for button
          tooltip: 'Imagens',//lang.olImagePlugin.tooltip,
          click:function (e) {
            context.invoke('olImagePlugin.show');
          }
        });
        return button.render();
      });
      
    this.show = function () {
        options.olImagePlugin.chagearea.call(this, 'textarea');
    };
    
    }//end olImagePlugin
})
}));