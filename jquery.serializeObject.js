(function(jQuery) {
	
	$.fn.extend({
		serializeObjectArray: function() {
			var rCRLF = /\r?\n/g;
				rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
				rselectTextarea = /^(?:select|textarea)/i,
				rcheckbox = /^(?:checkbox)/i;

			return this.map(function() {
				return this.elements ? jQuery.makeArray( this.elements ) : this;
			})
			.filter(function(){
				return this.name 
					   && !this.disabled 
					   && (rselectTextarea.test(this.nodeName) || rinput.test(this.type) || rcheckbox.test(this.type));
			})
			.map(function( i, elem ) {
				var val = $(this).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val, i ){
							return { elem: elem, name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						}) :
						{ elem: elem, name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			})
			.get();
		},
		
		serializeObject: function(model, options) {
			var jform = $(this),
				form = jform.serializeObjectArray(),
				i, len;
			for (i = 0, len = form.length; i < len; i++) {
				field = form[i];
				extract(model, field.elem, field.name, field.value);
			}
			return jform;
		}
	});
	
	function extract(obj, elem, name, value) {
		if (obj == null) return;
		var nameParts = name.split('.'),
			length = nameParts.length;
		if (length > 1) {
			var newName = nameParts.slice(1, length).join('.'),
				newObj = obj[nameParts[0]] || {};
			return extract(newObj, elem, newName, value);
		} else {
			return setValue(elem, obj, name, value);
		}
	}
	
	function setValue(elem, obj, name, value) {
		switch (elem.type) {
			case 'checkbox':
				return obj[name] = elem.checked;
			default:
				return obj[name] = value;
		}
	}

})(jQuery);