/**
 * $("input[name=]").bind('keypress', mask.birth);
 */
var mask = {
    money: function() 
    {
        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");
            v = new String(Number(v));
            var len = v.length;
            if (1 == len)
            {
                v = v.replace(/(\d)/, "0,0$1");
            }
            else if (2 == len)
            {
                v = v.replace(/(\d)/, "0,$1");
            }
            else if (len > 2) 
            {
                v = v.replace(/(\d{2})$/, ',$1');
            }
            return v;
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 1);
    },
    zip: function() 
    {
        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");            
            var len = v.length;
            if (5 === len) 
            {
                v = v.replace(/(\d)/, "$1");
            } 
            else if (8 == len) 
            {
                v = v.replace(/(\d{3})$/, '-$1');
            }
            return v;
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 1);
    },
    cpf: function() 
    {

        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");
            return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 1);
    },
    cnpj: function() 
    {
        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");
            v = new String(Number(v));
            var len = v.length;
            if (2 == len) 
            {
                return v.replace(/(\d{2})/g, "\$1.");
            } 
            else if (5 == len) 
            {
                return v.replace(/(\d{2})(\d{3})/g, "\$1.\$2.");
            } 
            else if (8 == len) 
            {
                return v.replace(/(\d{2})(\d{3})(\d{3})/g, "\$1.\$2.\$3");
            } 
            else if (12 == len) 
            {
                return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/g, "\$1.\$2.\$3\/\$4");
            } 
            else if (14 == len) 
            {
                return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
            }
            return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5"); 
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 1);
    },
    phone: function() 
    {
        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");
            var len = v.length;
            if (len == 10) 
            {
                return v.replace(/(\d{2})(\d{4})(\d{4})/g, "\($1) \$2\-\$3");
            } 
            else 
            {
                return v.replace(/(\d{2})(\d{4})(\d{5})/g, "\($1) \$2\-\$3");
            }
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 5);
    },
    birth: function() 
    {
        var el = this,
        exec = function(v) 
        {
            v = v.replace(/\D/g, "");
            var len = v.length;
            return v.replace(/(\d{2})(\d{2})(\d{4})/g, "\$1\/\$2\/\$3");
        };
        setTimeout(function() {
            el.value = exec(el.value);
        }, 5);
    },
    slug: function() 
    {
        var el = this,
        exec = function(v)
        {
            return v.toString()
                    .toLowerCase()
                    .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a')
                    .replace(/[èÈéÉêÊëË]+/g, 'e')
                    .replace(/[ìÌíÍîÎïÏ]+/g, 'i')
                    .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o')
                    .replace(/[ùÙúÚûÛüÜ]+/g, 'u')
                    .replace(/[ýÝÿŸ]+/g, 'y')
                    .replace(/[ñÑ]+/g, 'n')
                    .replace(/[çÇ]+/g, 'c')
                    .replace(/[ß]+/g, 'ss')
                    .replace(/[Ææ]+/g, 'ae')
                    .replace(/[Øøœ]+/g, 'oe')
                    .replace(/[%]+/g, 'pct')
                    .replace(/\s+/g, '_')
                    .replace(/[^\w\-]+/g, '')
                    //.replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
                    
        }
        setTimeout(function() {
            el.value = exec(el.value);
        }, 5);
    },

};

var validate = {
    mail : function(value)
    {
        var re = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi;        
        if (re.test(value)) return true; 
    },
};
	