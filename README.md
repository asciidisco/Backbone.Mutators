## Backbone.Mutators
Backbone plugin to override getters and setters with logic

## Build Status, Project Page, Annotated Source & Tests
[![Build Status](https://secure.travis-ci.org/asciidisco/Backbone.Mutators.png?branch=master)](http://travis-ci.org/asciidisco/Backbone.Mutators)<br /><br />
[Project Page](http://asciidisco.github.com/Backbone.Mutators/index.html)<br />
[Docs](http://asciidisco.github.com/Backbone.Mutators/docs/backbone.rpc.html)<br />
[Tests](http://asciidisco.github.com/Backbone.Mutators/test/index.html)<br />
[NPM registry](http://search.npmjs.org/#/Backbone.Mutators)

## Introduction
Ever wanted Backbone to have getters and setters you can override with your own logic?
Yes?! Then Backbone.Mutators is the missing tool in your chain...

## Installation

The plugin itself implements the Universal Module Definition (UMD).
You can use it with a CommonJS like loader, or with an AMD loader or via
vanilla javascript.

The plugin itself has two dependencies, underscore.js and backbone.js

You can directly download the 
[Development Version](https://raw.github.com/asciidisco/Backbone.Mutators/master/backbone.mutators.js)
or the
[Production Version](https://raw.github.com/asciidisco/Backbone.Mutators/master/backbone.mutators.min.js)
from the root folder

### AMD
```javascript
// AMD
require(['underscore', 'backbone', 'path/to/backbone.mutators'], function (_, Backbone, Mutators) {
  _.extend(Backbone.Model.prototype, Mutators.prototype);
  /* Do stuff with Backbone here */
});
```
### NPM
```shell
$ npm install Backbone.Mutators
```

### CommonJS
```javascript
// CommonJS
var _ = require('underscore');
var Backbone = require('backbone');
var Mutators = require('backbone.mutators');
 
_.extend(Backbone.Model.prototype, Mutators.prototype);
```

### Vanilla JS
```html
<!-- Vanilla javascript -->
<script src="path/to/underscore.js"></script>
<script src="path/to/backbone.js"></script>
<script src="path/to/backbone.mutators.js"></script>
<script>
	console.log(Backbone.Mutators); // Backbone and the Mutators property are globals
	_.extend(Backbone.Model.prototype, Backbone.Mutators.prototype);
</script>
```

## Usage

### Basic usage
```javascript
 var User = Backbone.Model.extend({
    mutators: {
        fullname: function () {
            return this.firstname + ' ' + this.lastname;
        }
    },
    defaults: {
    	firstname: 'Sebastian',
        lastname: 'Golasch'
    }
 });

 var user = new User();
 user.get('fullname') // returns 'Sebastian Golasch'
 user.toJSON() // return '{firstname: 'Sebastian', lastname: 'Golasch', fullname: 'Sebastian Golasch'}'
```