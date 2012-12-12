/*! Backbone.Mutators - v0.3.0
------------------------------
Build @ 2012-10-23
Documentation and Full License Available at:
http://asciidisco.github.com/Backbone.Mutators/index.html
git://github.com/asciidisco/Backbone.Mutators.git
Copyright (c) 2012 Sebastian Golasch <public@asciidisco.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the

Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.*/
(function(e,t,n,r,i,s,o){"use strict";typeof r=="object"?i.exports=s(n("underscore"),n("backbone")):typeof t=="function"&&t.amd?t(["underscore","backbone"],function(t,n){return t=t===o?e._:t,n=n===o?e.Backbone:n,e.returnExportsGlobal=s(t,n,e)}):e.returnExportsGlobal=s(e._,e.Backbone)})(this,this.define,this.require,this.exports,this.module,function(e,t,n,r){"use strict";t=t===r?n.Backbone:t,e=e===r?n._:e;var i=function(){},s=t.Model.prototype.get,o=t.Model.prototype.set,u=t.Model.prototype.toJSON;return i.prototype.get=function(t){var n=this.mutators!==r;return n===!0&&e.isFunction(this.mutators[t])===!0?e.bind(this.mutators[t],this.attributes)():n===!0&&e.isObject(this.mutators[t])===!0&&e.isFunction(this.mutators[t].get)===!0?e.bind(this.mutators[t].get,this.attributes)():s.call(this,t)},i.prototype.set=function(t,n,i){var s=this.mutators!==r,u=null,a=null,f=null;return e.isObject(t)||t===null?(a=t,i=n):(a={},a[t]=n),s===!0&&e.isObject(this.mutators[t])===!0&&e.isFunction(this.mutators[t].set)===!0&&(u=e.bind(this.mutators[t].set,this)(t,a[t],i,e.bind(o,this))),n===r&&i===r&&e.each(a,e.bind(function(t,n){s===!0&&e.isObject(this.mutators[n])===!0&&e.isFunction(this.mutators[n].set)===!0&&((i===r||e.isObject(i)===!0&&i.silent!==!0&&i.mutators!==r&&i.mutators.silent!==!0)&&this.trigger("mutators:set:"+n),u=e.bind(this.mutators[n].set,this)(n,t,i,e.bind(o,this)))},this)),u!==null?u:o.call(this,t,n,i)},i.prototype.toJSON=function(){var t=u.call(this);return e.each(this.mutators,e.bind(function(n,r){e.isObject(this.mutators[r])===!0&&e.isFunction(this.mutators[r].get)?t[r]=e.bind(this.mutators[r].get,this.attributes)():t[r]=e.bind(this.mutators[r],this.attributes)()},this)),t},e.extend(t.Model.prototype,i.prototype),t.Mutators=i,i});