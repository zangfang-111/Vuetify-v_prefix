'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  functional: true,

  name: 'v-list-tile-action',

  render: function render(h, _ref) {
    var data = _ref.data,
        children = _ref.children;

    data.staticClass = data.staticClass ? 'v-list__tile__action ' + data.staticClass : 'v-list__tile__action';
    if ((children || []).length > 1) data.staticClass += ' v-list__tile__action--stack';

    return h('div', data, children);
  }
};