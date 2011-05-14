$.fn.serializeObject = (model, options)->
	jform = $(@)
	form = jform.serializeArray()
	extract(model, field.name, field.value) for field in form
	return jform
	

extract = (obj, name, value) ->
	return unless obj?
	nameParts = name.split '.'
	if nameParts.length > 1
		newName = nameParts.slice(1, nameParts.length).join('.')
		newObj = obj[nameParts[0]] or {}
		extract newObj, newName, value
	else
		obj[name] = value