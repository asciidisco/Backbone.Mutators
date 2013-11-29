var _ = require('underscore');
var Backbone = require('Backbone');
require('../src/backbone.mutators');

exports['require'] = {

    "can get 'normal' value": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            mutators: {
                fullname: function () {
                    return this.firstname + ' ' + this.lastname;
                }
            }
        });

        var model = new Model();
        model.set('firstname', 'Sebastian');
        model.set('lastname', 'Golasch');

        test.equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
        test.equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
        test.done();
    },

    "can get 'mutated' value (newly created)": function (test) {
        test.expect(3);
        var Model = Backbone.Model.extend({
            mutators: {
                fullname: function () {
                    return this.get('firstname') + ' ' + this.get('lastname');
                }
            }
        });

        var model = new Model();
        model.set('firstname', 'Sebastian');
        model.set('lastname', 'Golasch');
        test.equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
        test.equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
        test.equal(model.get('fullname'), 'Sebastian Golasch', 'Can get mutated fullname');
        test.done();
    },

    "can get 'mutated' value (overridden)": function (test) {
        test.expect(5);
        var Model = Backbone.Model.extend({
            mutators: {
                status: function (key, value, options, set) {
                    if(key){
                        set('status', value);
                    }

                    return { status: this.attributes.status, overallStatus: this.get('overallStatus'), underestimatedNonOverallStatus: this.get('underestimatedNonOverallStatus') };
                }
            }
        });

        var model = new Model();
        model.set('overallStatus', 1);
        model.set('underestimatedNonOverallStatus', 3);
        model.set('status', 2);

        test.equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
        test.equal(model.get('underestimatedNonOverallStatus'), 3, 'Can get unmutated underestimatedNonOverallStatus');
        test.equal(model.get('status').status, 2, 'Can get mutated status');
        test.equal(model.get('status').overallStatus, 1, 'Can get mutated status');
        test.equal(model.get('status').underestimatedNonOverallStatus, 3, 'Can get mutated status');
        test.done();
    },

    "can get 'normal' value - object context": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            mutators: {
                fullanme: {
                    get: function () {
                        return this.get('firstname') + ' ' + this.get('lastname');
                    }
                }
            }
        });

        var model = new Model();
        model.set('firstname', 'Sebastian');
        model.set('lastname', 'Golasch');

        test.equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
        test.equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
        test.done();
    },

    "can get 'mutated' value (newly created) - object context": function (test) {
        test.expect(3);
        var Model = Backbone.Model.extend({
            mutators: {
                fullname: {
                    get: function () {
                        return this.get('firstname') + ' ' + this.get('lastname');
                    }
                }
            }
        });

        var model = new Model();
        model.set('firstname', 'Sebastian');
        model.set('lastname', 'Golasch');

        test.equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
        test.equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
        test.equal(model.get('fullname'), 'Sebastian Golasch', 'Can get mutated fullname');
        test.done();
    },

    "can get 'mutated' value (overridden) - object context": function (test) {
        test.expect(5);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    get: function () {
                        return { status: this.attributes.status, overallStatus: this.get('overallStatus'), underestimatedNonOverallStatus: this.get('underestimatedNonOverallStatus') };
                    }
                }
            }
        });

        var model = new Model();
        model.set('overallStatus', 1);
        model.set('underestimatedNonOverallStatus', 3);
        model.set('status', 2);

        test.equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
        test.equal(model.get('underestimatedNonOverallStatus'), 3, 'Can get unmutated underestimatedNonOverallStatus');
        test.equal(model.get('status').status, 2, 'Can get mutated status');
        test.equal(model.get('status').overallStatus, 1, 'Can get mutated status');
        test.equal(model.get('status').underestimatedNonOverallStatus, 3, 'Can get mutated status');
        test.done();
    },

    "can set 'normal' value (key <-> value)": function (test) {
        test.expect(1);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function () {
                        return { status: this.attributes.status, overallStatus: this.get('overallStatus'), underestimatedNonOverallStatus: this.get('underestimatedNonOverallStatus') };
                    }
                }
            }
        });

        var model = new Model();
        model.set('overallStatus', 1);

        test.equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
        test.done();
    },

    "can set 'mutated' value (key <-> value)": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options) {
                        this.set('pState', value.pState, options);
                        this.set('aState', value.aState, options);
                    }
                }
            }
        });

        var model = new Model();
        model.set('status', {pState: 1, aState: 2});

        test.equal(model.get('pState'), 1, 'Can get mutated pState');
        test.equal(model.get('aState'), 2, 'Can get mutated aState');
        test.done();
    },

    "can set 'normal' value (object)": function (test) {
        test.expect(1);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function () {
                        return { status: this.attributes.status, overallStatus: this.get('overallStatus'), underestimatedNonOverallStatus: this.get('underestimatedNonOverallStatus') };
                    }
                }
            }
        });

        var model = new Model();
        model.set({overallStatus: 1});

        test.equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
        test.done();
    },

    "can set attribute objects": function (test) {
        test.expect(3);
        var Model = Backbone.Model.extend({
            mutators: {
                fullname: {
                    set: function (key, value, options) {
                        var names = value.split(' ');
                        this.set('firstname', names[0], options);
                        this.set('lastname', names[1], options);
                    }
                }
            }
        });

        var model = new Model();
        model.set({ fullname: 'Sebastian Golasch', admin: true });

        test.equal(model.get('firstname'), 'Sebastian', 'Can get the firstname');
        test.equal(model.get('lastname'), 'Golasch', 'Can get the lastname');
        test.equal(model.get('admin'), true, 'Can get the admin status');
        test.done();
    },

    "can set newly created 'mutated' value (object)": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options) {
                        this.set('pState', value.pState, options);
                        this.set('aState', value.aState, options);
                    }
                }
            }
        });

        var model = new Model();
        model.set({status: {pState: 1, aState: 2, dState: 3}});

        test.equal(model.get('pState'), 1, 'Can get mutated pState');
        test.equal(model.get('aState'), 2, 'Can get mutated aState');
        test.done();
    },

    "can set 'mutated' value (object)": function (test) {
        test.expect(4);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options, set) {
                        if(_.isString(value)){
                            set(key, value);
                        } else {
                            this.set('pState', value.pState, options);
                            this.set('aState', value.aState, options);
                            if (value.pState === 1) {
                                set(key, 'supercool', options);
                            }
                        }
                    }
                }
            },
            defaults: {
                status: 'awkward'
            }
        });

        var model = new Model();

        test.equal(model.get('status'), 'awkward', 'Can get unmodified value');
        model.set({status: {pState: 1, aState: 2, dState: 3}});
        test.equal(model.get('status'), 'supercool', 'Can get mutated status value');
        test.equal(model.get('pState'), 1, 'Can get mutated pState');
        test.equal(model.get('aState'), 2, 'Can get mutated aState');
        test.done();
    },

    "can set a 'mutated' value and fire event": function (test) {
        test.expect(3);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options, set) {
                        set(key, value.toLowerCase(), options);
                    }
                }
            },
            defaults: {
                status: 'awkward'
            }
        });

        var model = new Model();

        model.bind('mutators:set:status', function () {
            test.ok(true, 'Callback called');
        });

        test.equal(model.get('status'), 'awkward', 'Can get unmodified value');
        model.set({status: 'SUPERCOOL'});
        test.equal(model.get('status'), 'supercool', 'Can get mutated status value');
        test.done();
    },

    "can set 'mutated' value and fire a mutated event": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options, set) {
                        set(key, value.toLowerCase(), options);
                    }
                }
            },
            defaults: {
                status: 'awkward'
            }
        });

        var model = new Model();

        model.bind('mutators:set:status', function () {
            test.ok(true, 'Callback called (And this shouldn´t happen)');
        });

        test.equal(model.get('status'), 'awkward', 'Can get unmodified value');
        model.set('status', 'SUPERCOOL', {silent: true});
        test.equal(model.get('status'), 'supercool', 'Can get mutated status value');
        test.done();
    },

    "can set 'mutated' value and fire event": function (test) {
        test.expect(4);
        var Model = Backbone.Model.extend({
            mutators: {
                status: {
                    set: function (key, value, options, set) {
                        set(key, value.toLowerCase(), options);
                    }
                }
            },
            defaults: {
                status: 'awkward'
            }
        });

        var model = new Model();

        model.bind('mutators:set:status', function () {
            test.ok(true, 'Callback called (And this shouldn´t happen)');
        });

        model.bind('change:status', function () {
            test.ok(true, 'Callback called (And this should happen)');
        });

        test.equal(model.get('status'), 'awkward', 'Can get unmodified value');
        model.set('status', 'SUPERCOOL', {mutators: {silent: true}});
        test.equal(model.get('status'), 'supercool', 'Can get mutated status value');
        test.done();
    },

    "can serialize an unmutated model": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            defaults: {
                a: 'a',
                b: 'b'
            }
        });

        test.equal((new Model()).toJSON().a, 'a', 'can serialize unmutated model');
        test.equal((new Model()).toJSON().b, 'b', 'can serialize unmutated model');
        test.done();
    },

    "can serialize mutated model": function (test) {
        test.expect(3);
        var Model = Backbone.Model.extend({
            defaults: {
                a: 'a',
                b: 'b'
            },
            mutators: {
                state: function () {
                    return this.get('a') + ', ' + this.get('b');
                }
            }
        });

        test.equal((new Model()).toJSON().a, 'a', 'can serialize mutated model');
        test.equal((new Model()).get('state'), 'a, b', 'can serialize mutated model');
        test.equal((new Model()).toJSON().state, 'a, b', 'can serialize mutated model');
        test.done();
    },

    "can escape mutated properties": function (test) {
        test.expect(2);
        var Model = Backbone.Model.extend({
            defaults: {
                a: 'a',
                b: 'b'
            },
            mutators: {
                b: function () {
                    return 'c';
                }
            }
        });

        var model = new Model();
        test.equal(model.get('b'), 'c');
        model.set('b', 'foobar');
        test.equal(model.get('b'), 'c');
        test.done();
    },

    "can get/set using single method": function (test) {
        test.expect(6);
        var Model = Backbone.Model.extend({
            mutators:{
                state:function(key, value){
                    if(key){
                        this.set("a", value);
                        test.equal(arguments.length, 4);
                        return null; //prevents ret from returning
                    }
                    return this.get("a");
                }
            }
        });

        var model = new Model();
        var value = "happy";
        model.set('state', value);

        test.equal(model.get('state'), value);
        var new_state = "excited",
        new_level = 10;

        //set multiple
        model.set({
            level:new_level,
            state:new_state
        });

        test.equal(model.get('state'), new_state);
        test.equal(model.get('level'), new_level);
        test.done();
    },
    
    "can omit transient variables from JSON when saving": function(test) {
      test.expect(4);
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
  
      var model = new Model();
      // First make sure we didn't break the accessor (or the normal model property
      // access)
      test.equal(model.get("fullName"), "Iain M. Banks");
      test.equal(model.get("firstName"), "Iain");
  
      // Ensure that a normal toJSON call (like you'd use with a template) includes
      // the computed value
      var modelToJSON = model.toJSON();
      test.equal(modelToJSON.fullName, "Iain M. Banks");
  
      // Backbone always sets 'emulateHTTP' to true or (usually) false when syncing, 
      // so we use the existence of that property as a proxy for "yes I'm syncing"
      var modelToJSONSync = model.toJSON({emulateHTTP:false});
      test.equal(typeof modelToJSONSync.fullName, "undefined");
      test.done();
    }
    

};
