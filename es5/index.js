'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('../src/stylus/app.styl');

var _components = require('./components');

var components = _interopRequireWildcard(_components);

var _directives = require('./directives');

var directives = _interopRequireWildcard(_directives);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Vuetify(Vue, args) {
  var Vuetify = components.Vuetify;

  Vue.use(Vuetify, _extends({
    components: components,
    directives: directives
  }, args));
}

Vuetify.version = '1.0.14';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuetify);
}

exports.default = Vuetify;