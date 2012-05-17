$(function () {
	
	var jform = $('#productForm'),
		obj 		= jform.serializeObject();
		
	
	module("serializeObject");
	
	test("is an object", function() {
		equal(typeof obj, 'object');
		equal(obj, null);
	});
	
	test("has property from text box", function() {
		equal(typeof obj.product.name, 'string');
	});
	
	test("has value from text box", function() {
		equal(obj.product.name, 'Apple');
		equal(obj.product.type, 'Fruit');
	});
	
	test("has value from hidden input", function() {
		equal(obj.product.id, '123456');
	});
	
	test("has value from checkbox", function() {
		equal(obj.product.active, true);
		equal(obj.product.soldout, false);
	});
	
	test("extracts array", function() {
		equal(obj.product.brands.length, 2);
		equal(obj.product.brands[0], 'Golden Gala');
		equal(obj.product.brands[1], 'Red Delicious');
	});
	
});