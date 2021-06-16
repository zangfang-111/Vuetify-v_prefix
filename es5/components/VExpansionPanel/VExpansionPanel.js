'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('../../../src/stylus/components/_expansion-panel.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _registrable = require('../../mixins/registrable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-expansion-panel',

  mixins: [_themeable2.default, (0, _registrable.provide)('expansionPanel')],

  provide: function provide() {
    return {
      panelClick: this.panelClick,
      focusable: this.focusable
    };
  },
  data: function data() {
    return {
      items: [],
      open: []
    };
  },


  props: {
    expand: Boolean,
    focusable: Boolean,
    inset: Boolean,
    popout: Boolean,
    value: {
      type: [Number, Array],
      default: function _default() {
        return null;
      }
    }
  },

  watch: {
    expand: function expand(v) {
      this.open = Array(this.items.length).fill(false);
      this.$emit('input', v ? this.open : null);
    },
    value: function value(v) {
      this.updateFromValue(v);
    }
  },

  methods: {
    updateFromValue: function updateFromValue(v) {
      if (Array.isArray(v) && !this.expand) return;

      var open = Array(this.items.length).fill(false);
      if (typeof v === 'number') {
        open[v] = true;
      } else if (v !== null) {
        open = v;
      }

      this.updatePanels(open);
    },
    updatePanels: function updatePanels(open) {
      this.open = open;
      for (var i = 0; i < this.items.length; i++) {
        var active = open && open[i];
        this.items[i].toggle(active);
      }
    },
    panelClick: function panelClick(uid) {
      var open = this.expand ? this.open.slice() : Array(this.items.length).fill(false);
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].uid === uid) {
          open[i] = !this.open[i];
          !this.expand && this.$emit('input', open[i] ? i : null);
        }
      }

      this.updatePanels(open);
      if (this.expand) this.$emit('input', open);
    },
    register: function register(uid, toggle) {
      this.items.push({ uid: uid, toggle: toggle });
      this.open.push(false);
    },
    unregister: function unregister(uid) {
      var index = this.items.findIndex(function (i) {
        return i.uid === uid;
      });
      this.items.splice(index, 1);
      this.open.splice(index, 1);
    }
  },

  mounted: function mounted() {
    this.value !== null && this.updateFromValue(this.value);
  },
  render: function render(h) {
    return h('ul', {
      staticClass: 'v-expansion-panel',
      'class': _extends({
        'v-expansion-panel--focusable': this.focusable,
        'v-expansion-panel--popout': this.popout,
        'v-expansion-panel--inset': this.inset
      }, this.themeClasses)
    }, this.$slots.default);
  }
};