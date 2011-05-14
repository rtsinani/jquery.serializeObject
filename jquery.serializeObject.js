(function() {
  var extract;
  $.fn.serializeObject = function(model, options) {
    var field, form, jform, _i, _len;
    jform = $(this);
    form = jform.serializeArray();
    for (_i = 0, _len = form.length; _i < _len; _i++) {
      field = form[_i];
      extract(model, field.name, field.value);
    }
    return jform;
  };
  extract = function(obj, name, value) {
    var nameParts, newName, newObj;
    if (obj == null) {
      return;
    }
    nameParts = name.split('.');
    if (nameParts.length > 1) {
      newName = nameParts.slice(1, nameParts.length).join('.');
      newObj = obj[nameParts[0]] || {};
      return extract(newObj, newName, value);
    } else {
      return obj[name] = value;
    }
  };
}).call(this);
