(function (root, define, require, exports, module, factory, undef) {
    'use strict';
    
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], function (_, Backbone) {
            // Check if we use the AMD branch of Back
            _ = _ === undef ? root._ : _;
            Backbone = Backbone === undef ? root.Backbone : Backbone;
            return (root.returnExportsGlobal = factory(_, Backbone, root));
        });
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root._, root.Backbone);
    }

// Usage:
//
// Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs
//
// Vanilla JS:
// <script src="underscore.js"></script>
// <script src="backbone.js"></script>
// <script src="backbone.mutators.js"></script>
//
// Node:
// var _ = require('underscore');
// var Backbone = require('backbone');
// var Mutators = require('backbone.mutators');
//
//
// AMD:
// define(['underscore', 'backbone', 'backbone.mutators'], function (_, Backbone, Mutators) {
//    // insert sample from below
//    return User;
// });
//
// var User = Backbone.Model.extend({
//    mutators: {
//        fullname: function () {
//            return this.firstname + ' ' + this.lastname;
//        }
//    },
//
//    defaults: {
//        firstname: 'Sebastian',
//        lastname: 'Golasch'
//    }
// });
//
// var user = new User();
// user.get('fullname') // returns 'Sebastian Golasch'
// user.toJSON() // return '{firstname: 'Sebastian', lastname: 'Golasch', fullname: 'Sebastian Golasch'}'

}(this, this.define, this.require, this.exports, this.module, function (_, Backbone, root, undef) {
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
        if (isMutator === true && _.isFunction(this.mutators[attr]) === true) {
            return _.bind(this.mutators[attr], this.attributes)();
        }

        // check if we have a deeper nested getter mutation
        if (isMutator === true && _.isObject(this.mutators[attr]) === true && _.isFunction(this.mutators[attr].get) === true) {
            return _.bind(this.mutators[attr].get, this.attributes)();
        }

        return oldGet.call(this, attr);
    };

    // override set functionality to set the mutator props
    Mutator.prototype.set = function (key, value, options) {
        var isMutator   = this.mutators !== undef,
            ret         = null,
            attrs       = null,
            attr        = null;

        // seamleassly stolen from backbone core
        // check if the setter action is triggered 
        // using key <-> value or object 
        if (_.isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

        // check if we have a deeper nested setter mutation
        if (isMutator === true && _.isObject(this.mutators[key]) === true) {

            // check if we need to set a single value
            if (_.isFunction(this.mutators[key].set) === true) {
                ret = _.bind(this.mutators[key].set, this)(key, attrs[key], options, _.bind(oldSet, this));
            }
        }

        if (_.isObject(attrs)) {
            _.each(attrs, _.bind(function (attr, attrKey) {
                var cur_ret = null;
                if (isMutator === true && _.isObject(this.mutators[attrKey]) === true) {
                    // check if we need to set a single value
                    if (_.isFunction(this.mutators[attrKey].set) === true) {
                        if (options === undef || (_.isObject(options) === true && options.silent !== true && (options.mutators !== undef && options.mutators.silent !== true))) {
                            this.trigger('mutators:set:' + attrKey);
                        }
                        cur_ret = _.bind(this.mutators[attrKey].set, this)(attrKey, attr, options, _.bind(oldSet, this));
                    }
                }
                if (cur_ret === null) {
                    cur_ret = _.bind(oldSet, this)(attrKey, attr, options);
                }

                if (ret !== false) ret = cur_ret;

            }, this));
        }

        if (ret !== null) {
            return ret;
        }

        return oldSet.call(this, key, value, options);
    };

    // override toJSON functionality to serialize mutator properties
    Mutator.prototype.toJSON = function () {
        // fetch ye olde values
        var attr = oldToJson.call(this);
        // iterate over all mutators (if there are some)
        _.each(this.mutators, _.bind(function (mutator, name) {
            // check if we have some getter mutations (nested or )
            if (_.isObject(this.mutators[name]) === true && _.isFunction(this.mutators[name].get)) {
                attr[name] = _.bind(this.mutators[name].get, this.attributes)();
            } else {
                attr[name] = _.bind(this.mutators[name], this.attributes)();
            }
        }, this));

        return attr;
    };

    // extend the models prototype
    _.extend(Backbone.Model.prototype, Mutator.prototype);

    // make mutators globally available under the Backbone namespace
    Backbone.Mutators = Mutator;
    return Mutator;
}));