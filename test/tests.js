module('Backbone.Mutators');

test("can get 'normal' value", function () {
    expect(2);
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

    equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
    equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
});

test("can get 'mutated' value (newly created)", function () {
    expect(3);
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
    equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
    equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
    equal(model.get('fullname'), 'Sebastian Golasch', 'Can get mutated fullname');
});

test("can get 'mutated' value (overridden)", function () {
    expect(5);
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

    equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
    equal(model.get('underestimatedNonOverallStatus'), 3, 'Can get unmutated underestimatedNonOverallStatus');
    equal(model.get('status').status, 2, 'Can get mutated status');
    equal(model.get('status').overallStatus, 1, 'Can get mutated status');
    equal(model.get('status').underestimatedNonOverallStatus, 3, 'Can get mutated status');
});

test("can get 'normal' value - object context", function () {
    expect(2);
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

    equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
    equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
});

test("can get 'mutated' value (newly created) - object context", function () {
    expect(3);
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

    equal(model.get('firstname'), 'Sebastian', 'Can get unmutated firstname');
    equal(model.get('lastname'), 'Golasch', 'Can get unmutated lastname');
    equal(model.get('fullname'), 'Sebastian Golasch', 'Can get mutated fullname');
});

test("can get 'mutated' value (overridden) - object context", function () {
    expect(5);
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

    equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
    equal(model.get('underestimatedNonOverallStatus'), 3, 'Can get unmutated underestimatedNonOverallStatus');
    equal(model.get('status').status, 2, 'Can get mutated status');
    equal(model.get('status').overallStatus, 1, 'Can get mutated status');
    equal(model.get('status').underestimatedNonOverallStatus, 3, 'Can get mutated status');
});

test("can set 'normal' value (key <-> value)", function () {
    expect(1);
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

    equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
});

test("can set 'mutated' value (key <-> value)", function () {
    expect(2);
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

    equal(model.get('pState'), 1, 'Can get mutated pState');
    equal(model.get('aState'), 2, 'Can get mutated aState');
});

test("can set 'normal' value (object)", function () {
    expect(1);
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

    equal(model.get('overallStatus'), 1, 'Can get unmutated overallStatus');
});

test("can set attribute objects", function () {
    expect(3);
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

    equal(model.get('firstname'), 'Sebastian', 'Can get the firstname');
    equal(model.get('lastname'), 'Golasch', 'Can get the lastname');
    equal(model.get('admin'), true, 'Can get the admin status');
});

test("can set newly created 'mutated' value (object)", function () {
    expect(2);
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

    equal(model.get('pState'), 1, 'Can get mutated pState');
    equal(model.get('aState'), 2, 'Can get mutated aState');
});

test("can set 'mutated' value (object)", function () {
    expect(4);
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

    equal(model.get('status'), 'awkward', 'Can get unmodified value');
    model.set({status: {pState: 1, aState: 2, dState: 3}});
    equal(model.get('status'), 'supercool', 'Can get mutated status value');
    equal(model.get('pState'), 1, 'Can get mutated pState');
    equal(model.get('aState'), 2, 'Can get mutated aState');

});

test("can set 'mutated' value and fire event", function () {
    expect(3);
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
        ok(true, 'Callback called');
    });

    equal(model.get('status'), 'awkward', 'Can get unmodified value');
    model.set({status: 'SUPERCOOL'});
    equal(model.get('status'), 'supercool', 'Can get mutated status value');

});

test("can set 'mutated' value and fire event", function () {
    expect(2);
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
        ok(true, 'Callback called (And this shouldn´t happen)');
    });

    equal(model.get('status'), 'awkward', 'Can get unmodified value');
    model.set('status', 'SUPERCOOL', {silent: true});
    equal(model.get('status'), 'supercool', 'Can get mutated status value');

});

test("can set 'mutated' value and fire event", function () {
    expect(4);
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
        ok(true, 'Callback called (And this shouldn´t happen)');
    });

    model.bind('change:status', function () {
        ok(true, 'Callback called (And this should happen)');
    });

    equal(model.get('status'), 'awkward', 'Can get unmodified value');
    model.set('status', 'SUPERCOOL', {mutators: {silent: true}});
    equal(model.get('status'), 'supercool', 'Can get mutated status value');

});

test("can serialize an unmutated model", function () {
    expect(2);
    var Model = Backbone.Model.extend({
        defaults: {
            a: 'a',
            b: 'b'
        }
    });

    equal((new Model()).toJSON().a, 'a', 'can serialize unmutated model');
    equal((new Model()).toJSON().b, 'b', 'can serialize unmutated model');
});

test("can serialize mutated model", function () {
    expect(3);
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

    equal((new Model()).toJSON().a, 'a', 'can serialize mutated model');
    equal((new Model()).get('state'), 'a, b', 'can serialize mutated model');
    equal((new Model()).toJSON().state, 'a, b', 'can serialize mutated model');
});

test("can escape mutated properties", function () {
    expect(2);
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
    equal(model.get('b'), 'c');
    model.set('b', 'foobar');
    equal(model.get('b'), 'c');
});

test("can get/set using single method", 6, function(){

    var Model = Backbone.Model.extend({
        mutators:{
            state:function(key, value){
                if(key){
                    this.set("a", value);

                    equal(arguments.length, 4);
                    return null; //prevents ret from returning
                }

                return this.get("a");
            }
        }
    });

    var model = new Model();

    var value = "happy";
    model.set('state', value);

    equal(model.get('state'), value);

    var new_state = "excited",
    new_level = 10;


    //set multiple
    model.set({
        level:new_level,
        state:new_state
    });

    equal(model.get('state'), new_state);
    equal(model.get('level'), new_level);

});

test("can omit transient variables from JSON when saving", 4, function() {
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
  equal(model.get("fullName"), "Iain M. Banks");
  equal(model.get("firstName"), "Iain");
  
  // Ensure that a normal toJSON call (like you'd use with a template) includes
  // the computed value
  var modelToJSON = model.toJSON();
  equal(modelToJSON.fullName, "Iain M. Banks");
  
  // Backbone always sets 'emulateHTTP' to true or (usually) false when syncing, 
  // so we use the existence of that property as a proxy for "yes I'm syncing"
  var modelToJSONSync = model.toJSON({emulateHTTP:false});
  equal(typeof modelToJSONSync.fullName, "undefined");
});
