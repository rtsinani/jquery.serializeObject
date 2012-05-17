A jQuery plugin that serializes a form into an object. The object can then be passed to an ajax call as `data` to be processed on the server side.

### Usage

Let's have a simple form like below:

```html
	<form action="" method="post">
		<input type="hidden" name="product.id" value="123456" />
		<input type="text" name="product.name" value="Apple" />
		<input type="text" name="product.type" value="Fruit" />
		<input type="checkbox" name="product.active" checked="checked" />
		<input type="checkbox" name="product.soldout" />
		<input type="text" name="product.brands[0]" value="Golden Gala" />
		<input type="text" name="product.brands[1]" value="Red Delicious" />
	</form>
```

Call `serializeObject` on the form's jQuery object:

```js
	var obj = $('form').serializeObject();
```

The result is:

```js
	{
	  product: {
	    id		: "123456",
	    name	: "Apple",
	    type	: "Fruit",
	    active	: true,
	    soldout	: false,
	    brands	: [ "Golden Gala", "Red Delicious" ]
	  }
	}
```

---

Copyright &copy; 2010-2012 Artan Sinani