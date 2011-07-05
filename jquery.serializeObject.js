(function (jQuery) {
    var rCRLF = /\r?\n/g,
        rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
		rselectTextarea = /^(?:select|textarea)/i,
		rcheckbox = /^(?:checkbox)/i;

    $.fn.extend({
        serializeObjectArray: function () {

            return this.map(function () {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
			.filter(function () {
			    return this.name && !this.disabled
					   && (rselectTextarea.test(this.nodeName) || rinput.test(this.type) || rcheckbox.test(this.type));
			})
			.map(function (i, elem) {
			    var val = $(this).val();
			    return val == null ?
					null :
					jQuery.isArray(val) ?
						jQuery.map(val, function (val, i) {
						    return { elem: elem, name: elem.name, value: val.replace(rCRLF, "\r\n") };
						}) :
						{ elem: elem, name: elem.name, value: val.replace(rCRLF, "\r\n") };
			})
			.get();
        },

        serializeObject: function (opts) {
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
                    isCheckbox = rcheckbox.test(field.elem.type),
					j, namePartsLen, value;

                for (j = 0, namePartsLen = nameParts.length; j < namePartsLen; j++) {
                    var namePart = nameParts[j],
						bracketPos = namePart.indexOf('['),
						arrName;
                    if (namePart.indexOf('[]') > -1 && j == namePartsLen - 1) {
                        arrName = namePart.substr(0, namePart.indexOf('['));
                        if (!currResult[arrName]) currResult[arrName] = [];
                        if (!isCheckbox || (isCheckbox && field.elem.checked)) currResult[arrName].push(field.value);
                    } else {
                        if (namePart.indexOf('[') > -1) {
                            var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');

                            arrName = namePart.substr(0, bracketPos);
                            arrays[arrName] = arrays[arrName] || {};
                            currResult[arrName] = currResult[arrName] || [];
                            if (j == namePartsLen - 1) {
                                currResult[arrName].push(field.value);
                            } else {
                                if (!arrays[arrName][arrIdx]) {
                                    currResult[arrName].push({});
                                    if (!isCheckbox || (isCheckbox && field.elem.checked))
                                        arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
                                }
                            }
                            currResult = arrays[arrName][arrIdx];
                        } else {
                            if (j < namePartsLen - 1) {
                                if (!currResult[namePart]) currResult[namePart] = {};
                                currResult = currResult[namePart];
                            } else {
                                //currResult[namePart] = field.value;
                                setValue(currResult, field, namePart);
                            }
                        }
                    }
                }
            }

            function getAfterFirstDelimiter(text) {
                return text.slice(text.indexOf(delimiter) + 1);
            }

            return result;
        }
    });

    function setValue(obj, field, name) {
        switch (field.elem.type) {
            case 'checkbox':
                return obj[name] = field.elem.checked;
            default:
                var val = field.value;
                if (isNumberable(val)) val = parseFloat(val)
                return obj[name] = val;
        }
    }

    function getValue(field) {
        switch (field.elem.type) {
            case 'checkbox':
                return field.elem.checked;
            default:
                return field.value;
        }
    }

    function isNumberable(strng) {
        return /^[0-9]+$/g.test(strng);
    }


})(jQuery);