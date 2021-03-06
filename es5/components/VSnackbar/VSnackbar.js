'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_snackbars.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _toggleable = require('../../mixins/toggleable');

var _toggleable2 = _interopRequireDefault(_toggleable);

var _positionable = require('../../mixins/positionable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-snackbar',

  mixins: [_colorable2.default, _toggleable2.default, (0, _positionable.factory)(['absolute', 'top', 'bottom', 'left', 'right'])],

  data: function data() {
    return {
      activeTimeout: {}
    };
  },


  props: {
    autoHeight: Boolean,
    multiLine: Boolean,
    // TODO: change this to closeDelay to match other API in delayable.js
    timeout: {
      type: Number,
      default: 6000
    },
    vertical: Boolean
  },

  computed: {
    classes: function classes() {
      return {
        'v-snack--active': this.isActive,
        'v-snack--absolute': this.absolute,
        'v-snack--auto-height': this.autoHeight,
        'v-snack--bottom': this.bottom || !this.top,
        'v-snack--left': this.left,
        'v-snack--multi-line': this.multiLine && !this.vertical,
        'v-snack--right': this.right,
        'v-snack--top': this.top,
        'v-snack--vertical': this.vertical
      };
    }
  },

  watch: {
    isActive: function isActive() {
      this.setTimeout();
    }
  },

  methods: {
    setTimeout: function (_setTimeout) {
      function setTimeout() {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function () {
      var _this = this;

      clearTimeout(this.activeTimeout);

      if (this.isActive && this.timeout) {
        this.activeTimeout = setTimeout(function () {
          _this.isActive = false;
        }, this.timeout);
      }
    })
  },

  mounted: function mounted() {
    this.setTimeout();
  },
  render: function render(h) {
    var children = [];

    if (this.isActive) {
      children.push(h('div', {
        staticClass: 'v-snack',
        class: this.classes,
        on: this.$listeners
      }, [h('div', {
        staticClass: 'v-snack__wrapper',
        class: this.addBackgroundColorClassChecks()
      }, [h('div', {
        staticClass: 'v-snack__content'
      }, this.$slots.default)])]));
    }

    return h('transition', {
      attrs: { name: 'snack-transition' }
    }, children);
  }
};