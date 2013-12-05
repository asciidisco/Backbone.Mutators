## Backbone.Mutators
Backbone plugin to override getters and setters with logic

## Build Status, Project Page, Annotated Source & Tests
[![Build Status](https://secure.travis-ci.org/asciidisco/Backbone.Mutators.png?branch=master)](http://travis-ci.org/asciidisco/Backbone.Mutators)
[![Unit Test Status](https://saucelabs.com/buildstatus/asciidisco)](https://saucelabs.com/u/asciidisco)<br /><br />
[Project Page](http://asciidisco.github.com/Backbone.Mutators/index.html)<br />
[Docs](http://asciidisco.github.com/Backbone.Mutators/docs/backbone.mutators.html)<br />
[Tests](http://asciidisco.github.com/Backbone.Mutators/test/index.html)<br />
[NPM registry](http://search.npmjs.org/#/Backbone.Mutators)

## Introduction
Ever wanted Backbone to have getters and setters you can override with your own logic?
Yes?! Then Backbone.Mutators is the missing tool in your chain...

## Installation

The plugin itself implements the Universal Module Definition (UMD).
You can use it with a CommonJS like loader, or with an AMD loader or via
vanilla javascript.

The plugin has two dependencies, underscore.js and backbone.js

### Download
You can directly download the
[Development Version](https://raw.github.com/asciidisco/Backbone.Mutators/master/backbone.mutators.js)
or the
[Production Version](https://raw.github.com/asciidisco/Backbone.Mutators/master/backbone.mutators.min.js)
from the root folder

### VOLO
```shell
$ volo add Backbone.Mutators
```

### NPM
```shell
$ npm install Backbone.Mutators
```

## Integration

### AMD
```javascript
// AMD
require(['underscore', 'backbone', 'path/to/backbone.mutators'], function (_, Backbone, Mutators) {
  /* Do stuff with Backbone here */
});
```

### CommonJS
```javascript
// CommonJS
var _ = require('underscore');
var Backbone = require('backbone');
var Mutators = require('backbone.mutators');
```

### Vanilla JS
```html
<!-- Vanilla javascript -->
<script src="path/to/underscore.js"></script>
<script src="path/to/backbone.js"></script>
<script src="path/to/backbone.mutators.js"></script>
<script>
	console.log(Backbone.Mutators); // Backbone and the Mutators property are globals
</script>
```

## Usage
Some lines of code explain more then thousand words...

### Basic usage
```javascript
 var User = Backbone.Model.extend({
 	// Define mutator properties
    mutators: {
        fullname: function () {
            return this.get('firstname') + ' ' + this.get('lastname');
        }
    },
    defaults: {
    	firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });

 var user = new User();
 // use get to get the 'mutated' value
 user.get('fullname') // 'Sugar Daddy'
 // serialize the model and see the 'mutated' value in the resulting JSON
 user.toJSON() // '{firstname: 'Sugar', lastname: 'Daddy', fullname: 'Sugar Daddy'}'
```

### Override getters
```javascript
 var State = Backbone.Model.extend({
 	// Define mutator properties
    mutators: {
        status: function () {
            return this.get('status') === true ? 'Workish' : 'Bad bad error';
        }
    },
    defaults: {
    	status: true
    }
 });

 var state = new State();
 // use get to get the 'mutated' value
 state.get('status') // 'Workish'
 // serialize the model and see the 'mutated' value in the resulting JSON
 state.toJSON() // '{status: 'Workish'}'
```

### Use setters
```javascript
 var User = Backbone.Model.extend({
 	// Define mutator properties
    mutators: {
        fullname: {
			set: function (key, value, options, set) {
				var names = value.split(' ');
				this.set('firstname', names[0], options);
				this.set('lastname', names[1], options);
			},
        	get: function () {
            	return this.get('firstname') + ' ' + this.get('lastname');
        	}
        }
    },
    defaults: {
    	firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });

 var user = new User();
 // use get to get the 'mutated' value
 user.set('fullname', 'Big Mama', {silent: true});
 // serialize the model and see the 'mutated' value in the resulting JSON
 user.get('fullname') // 'Big Mama'
 user.get('firstname'); // 'Big'
 user.get('lastname'); // 'Mama'
```

### Catch model events
```javascript
 var User = Backbone.Model.extend({
    // Define mutator properties
    mutators: {
        fullname: {
            set: function (key, value, options, set) {
                var names = value.split(' ');
                this.set('firstname', names[0], options);
                this.set('lastname', names[1], options);
            },
            get: function () {
                return this.get('firstname') + ' ' + this.get('lastname');
            }
        }
    },
    defaults: {
        firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });

 var user = new User();

 // bind mutator event
 user.bind('mutators:set:fullname', function () {
    console.log('Somebody sets a full name');
 });

 // bind model events
 user.bind('change:firstname', function () {
    console.log('Somebody changed the first name');
 });

  // bind model events
 user.bind('change:lastname', function () {
    console.log('Somebody changed the last name');
 });

 // use get to get the 'mutated' value
 user.set('fullname', 'Big Mama');

 // serialize the model and see the 'mutated' value in the resulting JSON
 user.get('fullname') // 'Big Mama'
 user.get('firstname'); // 'Big'
 user.get('lastname'); // 'Mama'
```

### Silence mutator events (while keeping the model events fired)
```javascript
 var User = Backbone.Model.extend({
    // Define mutator properties
    mutators: {
        fullname: {
            set: function (key, value, options, set) {
                var names = value.split(' ');
                this.set('firstname', names[0], options);
                this.set('lastname', names[1], options);
            },
            get: function () {
                return this.get('firstname') + ' ' + this.get('lastname');
            }
        }
    },
    defaults: {
        firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });

 var user = new User();

 // bind mutator event
 // will never be run
 user.bind('mutators:set:fullname', function () {
    console.log('Somebody sets a full name');
 });

 // bind model events
 // will still run
 user.bind('change:firstname', function () {
    console.log('Somebody changed the first name');
 });

 // bind model events
 // will still run
 user.bind('change:lastname', function () {
    console.log('Somebody changed the last name');
 });

 // use get to get the 'mutated' value
 user.set('fullname', 'Big Mama', {mutators: {silence: true}});

 // serialize the model and see the 'mutated' value in the resulting JSON
 user.get('fullname') // 'Big Mama'
 user.get('firstname'); // 'Big'
 user.get('lastname'); // 'Mama'
```

### Use mutated setters and call the original setter within
```javascript
 var Spicy = Backbone.Model.extend({
    // Define mutator properties
    mutators: {
        iAcceptOnlyLowercaseStuff: {
            set: function (key, value, options, set) {
                // call the original setter with the lowercased value
                set(key, value.toLowerCase(), options);
            }
        }
    },
    defaults: {
        iAcceptOnlyLowercaseStuff: 'sugar'
    }
 });

 var spicy = new Spicy();
 // use get to get the 'mutated' value
 spicy.set('iAcceptOnlyLowercaseStuff', 'SALT');
 spicy.get('iAcceptOnlyLowercaseStuff') // 'salt'
```

### Define one getter / setter method
```javascript
 var User = Backbone.Model.extend({
    // Define mutator properties
    mutators: {
        fullname: function (key, value, options, set) {
            if(key){
                var names = value.split(' ');
                this.set('firstname', names[0], options);
                this.set('lastname', names[1], options);
            }

            return this.get('firstname') + ' ' + this.get('lastname');
        }
    },
    defaults: {
        firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });
```

### Define multiple mutators
```javascript
 var User = Backbone.Model.extend({
 	// Define mutator properties
    mutators: {
        fullname: {
			set: function (key, value, options, set) {
				var names = value.split(' ');
				this.set('firstname', names[0], options);
				this.set('lastname', names[1], options);
			}
        	get: function () {
                return this.get('firstname') + ' ' + this.get('lastname');
        	}
        },
        password: function () {
    		return md5(this.password);
    	}
    },
    defaults: {
    	firstname: 'Sugar',
        lastname: 'Daddy'
    }
 });
```

### Define a getter as transient
Defining a getter as transient means that it will be omitted when Backbone saves the model. This is 
useful if the backend system (whatever Backbone is syncing to) fails if you send it a property that does
not actually exist on the model. Note that this only works for mutators defined with a `get()`
function.

In the example below, the `fullName` property will be available when toJSON is called under
non-syncing circumstances--for example, when providing this model to a template--but will be omitted
from the JSON when sync is called (because you called the `sync()` or `save()` method), and will not
be sent to the server.
```javascript
var Model = Backbone.Model.extend({
  defaults:{
    firstName:"Iain",
    middleInit:"M",
    lastName:"Banks"
  },
  mutators:{
    fullName:{
      get: function() {
        var fullName = this.get("firstName");
        fullName += " " + this.get("middleInit");
        fullName += ". " + this.get("lastName");
        return fullName;
      },
      transient: true
    }
  }
});
```

## Further reading
James Brown ([@ibjhb](https://github.com/ibjhb/Exploring-Backbone.Mutators))
has written a blog article about Mutators ([Exploring Backbone.Mutators](http://ja.mesbrown.com/2012/03/exploring-backbone-mutators-plugin/))

## Changelog

### 0.4.1
+ Fixes [#22](https://github.com/asciidisco/Backbone.Mutators/pull/22)
+ Fixes [#24](https://github.com/asciidisco/Backbone.Mutators/pull/24)

### 0.3.1
+ Change get context to modal instead of attributes
+ Added single getter / setter method

### 0.3.1
+ Change get context to modal instead of attributes
+ Added single getter / setter method

### 0.3.0
+ Removed the Cake based build process and moved to grunt
+ Mutators now integrates itself to backbone, no more manual extending needed
+ Added the {mutator: {silent: true}} option to prevent mutator set events from firering
+ Added unit tests for the new features
+ Moved from jslint to jshint
+ Tweaked docs
+ Removed not needed jquery and qunit-logging submodule / npm dependencies

### 0.2.0
+ Added the original Backbone.Model.set function as a fourth paramter for the mutated set
+ Added a 'mutators:set:{{YOUR_MUTATOR_PROPERTY}}' event when setting mutated properties
+ Added unit tests for the new features
+ Extended/fixed documentation
+ Added inline version tag [NOTE: Version 0.2.0 is fully backwards compatible]

### 0.1.0
+ Initial Release
