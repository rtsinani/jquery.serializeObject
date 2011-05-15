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
				return this.name && !this.disabled 
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
		
		serializeObject: function(model, opts) {
			// based on form2object http://code.google.com/p/form2js/
			// options: delimiter, prefix
			
			var options = opts || {},
				delimiter = options.delimiter || '.',
				jform = $(this),
				form = jform.serializeObjectArray(),
				result = {},
				arrays = [],
				i, len;
			for (i = 0, len = form.length; i < len; i++) {
				var field = form[i];
				if (field.value === '') continue;
				var currResult = result,
					name = options.prefix ? getAfterFirstDelimiter(field.name) : field.name,
					nameParts = name.split(delimiter),
					j, namePartsLen;
				
				for (j = 0, namePartsLen = nameParts.length; j < namePartsLen; j++) {
					var namePart = nameParts[j],
						bracketPos = namePart.indexOf('['),
						arrName;
					if (namePart.indexOf('[]') > -1 && j == namePartsLen - 1) {
						arrName = namePart.substr(0, namePart.indexOf('['));
						if (!currResult[arrName]) currResult[arrName] = [];
						currResult[arrName].push(field.value);
					} else {
						if (namePart.indexOf('[') > -1) {
							var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
							
							arrName = namePart.substr(0, bracketPos);
							arrays[arrName] = arrays[arrName] || {};
							currResult[arrName] = currResult[arrName] || [];
							if (j == namePartsLen - 1)
							{
								currResult[arrName].push(field.value);
							}
							else
							{
								if (!arrays[arrName][arrIdx])
								{
									currResult[arrName].push({});
									arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
								}
							}
							currResult = arrays[arrName][arrIdx];
						} else {
							if (j < namePartsLen - 1) {
								currResult[namePart] = currResult[namePart] || {};
							} else {
								setValue(currResult, field, namePart);
							}
						}
					}					
				}
			}
			$.extend(model, result);

			function setValue(obj, field, name) {
				switch (field.elem.type) {
					case 'checkbox':
						return obj[name] = field.elem.checked;
					default:
						return obj[name] = field.value;
				}
			}
			
			
			
			return jform;
		}
	});
	
	

})(jQuery);