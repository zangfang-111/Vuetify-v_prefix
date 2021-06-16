'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('../../../src/stylus/components/_icons.styl');

var _helpers = require('../../util/helpers');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SIZE_MAP = {
  small: '16px',
  default: '24px',
  medium: '28px',
  large: '36px',
  xLarge: '40px'
};

function isFontAwesome5(iconType) {
  return ['fas', 'far', 'fal', 'fab'].some(function (val) {
    return iconType.includes(val);
  });
}

var ICONS_PREFIX = '$vuetify.icons.';

// This remaps internal names like '$vuetify.icons.cancel' to the current name
// for that icon. Note the parent component is needed for $vuetify because
// VIcon is a functional component. This function only looks at the
// immediate parent, so it won't remap for a nested functional components.
function remapInternalIcon(parent, iconName) {
  if (!iconName.startsWith(ICONS_PREFIX)) {
    // return original icon name unchanged
    return iconName;
  }

  // Now look up icon indirection name, e.g. '$vuetify.icons.cancel':
  return (0, _helpers.getObjectValueByPath)(parent, iconName) || iconName;
}

exports.default = {
  name: 'v-icon',

  functional: true,

  mixins: [_colorable2.default, _themeable2.default],

  props: {
    disabled: Boolean,
    large: Boolean,
    left: Boolean,
    medium: Boolean,
    right: Boolean,
    size: {
      type: [Number, String]
    },
    small: Boolean,
    xLarge: Boolean
  },

  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        parent = _ref.parent,
        _ref$children = _ref.children,
        children = _ref$children === undefined ? [] : _ref$children;
    var small = props.small,
        medium = props.medium,
        large = props.large,
        xLarge = props.xLarge;

    var sizes = { small: small, medium: medium, large: large, xLarge: xLarge };
    var explicitSize = Object.keys(sizes).find(function (key) {
      return sizes[key] && key;
    });
    var fontSize = explicitSize && SIZE_MAP[explicitSize] || props.size;

    if (fontSize) data.style = _extends({ fontSize: fontSize }, data.style);

    var iconName = '';
    if (children.length) iconName = children.pop().text;
    // Support usage of v-text and v-html
    else if (data.domProps) {
        iconName = data.domProps.textContent || data.domProps.innerHTML || iconName;

        // Remove nodes so it doesn't
        // overwrite our changes
        delete data.domProps.textContent;
        delete data.domProps.innerHTML;
      }

    // Remap internal names like '$vuetify.icons.cancel' to the current name for that icon
    iconName = remapInternalIcon(parent, iconName);

    var iconType = 'material-icons';
    // Material Icon delimiter is _
    // https://material.io/icons/
    var delimiterIndex = iconName.indexOf('-');
    var isCustomIcon = delimiterIndex > -1;

    if (isCustomIcon) {
      iconType = iconName.slice(0, delimiterIndex);

      if (isFontAwesome5(iconType)) iconType = '';
      // Assume if not a custom icon
      // is Material Icon font
    } else children.push(iconName);

    data.attrs = data.attrs || {};
    if (!('aria-hidden' in data.attrs)) {
      data.attrs['aria-hidden'] = true;
    }

    var classes = Object.assign({
      'v-icon--disabled': props.disabled,
      'v-icon--left': props.left,
      'v-icon--right': props.right,
      'theme--dark': props.dark,
      'theme--light': props.light
    }, props.color ? _colorable2.default.methods.addTextColorClassChecks.call(props, {}, props.color) : {});

    // Order classes
    // * Component class
    // * Vuetify classes
    // * Icon Classes
    data.staticClass = ['v-icon', data.staticClass, Object.keys(classes).filter(function (k) {
      return classes[k];
    }).join(' '), iconType, isCustomIcon ? iconName : null].reduce(function (prev, curr) {
      return curr ? prev + ' ' + curr : prev;
    }).trim();

    return h('i', data, children);
  }
};