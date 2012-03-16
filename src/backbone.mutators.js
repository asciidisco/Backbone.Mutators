/*jslint nomen: true, unparam: true, indent: 4,  maxlen: 160, es5: false */

// Backbone.Mutators v0.1.0
//
//
// Documentation and Full License Available at:
// http://github.com/asciidisco/Backbone.Mutators

// Usage:
//
// Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs
//
// Vanilla JS:
// <script src="underscore.js"></script>
// <script src="backbone.js"></script>
// <script src="backbone.mutators.js"></script>
//
// AMD:
// define(['underscore', 'backbone', 'backbone.mutators'], function (_, Backbone, Mutators) {
//     _.extend(Backbone.Model.prototype, Mutators.prototype);
//    // insert sample from below
//    return User;
//
// HINT: If you use some plugin like Backbone.Relational you need to do smth. like this:
// _.extend(Backbone.RelationalModel.prototype, Mutators.prototype);
// });
//
// var User = Backbone.Model.extend({
//    mutators: {
//        fullname: function () {
//            return this.forename + ' ' + this.lastname;
//        }
//    },
//
//    defaults: {
//        forename: 'Sebastian',
//        lastname: 'Golasch'
//    }
// });
//
// var user = new User();
// user.get('fullname') // returns 'Sebastian Golasch'
// user.toJSON() // return '{surename: 'Sebastian', lastname: 'Golasch', fullname: 'Sebastian Golasch'}'

(function (root, define, require, exports, module, factory, undef) {
    'use strict';

    // Set up Backbone appropriately for the environment.
    if (typeof exports !== 'undefined') {
        // Node/CommonJS
        factory(root, require('underscore'), require('backbone'), exports);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define('mutators', ['underscore', 'backbone', 'exports'], function (root, _, Backbone, exports) {
            return factory(root, exports, _, Backbone);
        });
    } else {
        // Browser globals
        root.Backbone = factory(root, {}, root._);
    }
}(this, this.define, this.require, this.exports, this.module, function (root, _, Backbone, exports, undef) {
    'use strict';

    // check if we use the amd branch of backbone and underscore
    Backbone = Backbone === undef ? root.Backbone : Backbone;
    _ = _ === undef ? root._ : _;

    // extend backbones model prototype with the mutator functionality
    var Mutator     = function () {},
        oldGet      = Backbone.Model.prototype.get,
        oldSet      = Backbone.Model.prototype.set,
        oldToJson   = Backbone.Model.prototype.toJSON;

    // override get functionality to fetch the mutator props
    Mutator.prototype.get = function (attr) {
        var isMutator = this.mutators !== undef;

        // check if we have a getter mutation
        if (isMutator === true && typeof this.mutators[attr] === 'function') {
            return _.bind(this.mutators[attr], this.attributes)();
        }

        // check if we have a deeper nested getter mutation
        if (isMutator === true && typeof this.mutators[attr] === 'object' && _.isArray(this.mutators[attr]) === false) {
            return _.bind(this.mutators[attr], this.attributes)();
        }

        return oldGet.call(this, attr);
    };

    // override get functionality to set the mutator props
    Mutator.prototype.set = function (attr) {
        return oldSet.call(this, attr);
    };

    // override toJSON functionality to serialize mutator properties
    Mutator.prototype.toJSON = function () {
        var attr = oldToJson.call(this);
        _.each(this.mutators, _.bind(function (mutator, name) {
            attr[name] = _.bind(this.mutators[name], this.attributes)();
        }, this));

        return attr;
    };

    return Mutator;
}));