'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_cards.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _routable = require('../../mixins/routable');

var _routable2 = _interopRequireDefault(_routable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-card',

  mixins: [_colorable2.default, _routable2.default, _themeable2.default],

  props: {
    flat: Boolean,
    height: {
      type: String,
      default: 'auto'
    },
    hover: Boolean,
    img: String,
    raised: Boolean,
    tag: {
      type: String,
      default: 'div'
    },
    tile: Boolean,
    width: [String, Number]
  },

  computed: {
    classes: function classes() {
      return this.addBackgroundColorClassChecks({
        'v-card': true,
        'v-card--flat': this.flat,
        'v-card--horizontal': this.horizontal,
        'v-card--hover': this.hover,
        'v-card--raised': this.raised,
        'v-card--tile': this.tile,
        'theme--light': this.light,
        'theme--dark': this.dark
      });
    },
    styles: function styles() {
      var style = {
        height: isNaN(this.height) ? this.height : this.height + 'px'
      };

      if (this.img) {
        style.background = 'url("' + this.img + '") center center / cover no-repeat';
      }

      if (this.width) {
        style.width = isNaN(this.width) ? this.width : this.width + 'px';
      }

      return style;
    }
  },

  render: function render(h) {
    var _generateRouteLink = this.generateRouteLink(),
        tag = _generateRouteLink.tag,
        data = _generateRouteLink.data;

    data.style = this.styles;

    return h(tag, data, this.$slots.default);
  }
};