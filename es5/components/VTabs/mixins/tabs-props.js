'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Tabs props
 *
 * @mixin
 */
exports.default = {
  props: {
    alignWithTitle: Boolean,
    centered: Boolean,
    fixedTabs: Boolean,
    grow: Boolean,
    height: {
      type: [Number, String],
      default: undefined,
      validator: function validator(v) {
        return !isNaN(parseInt(v));
      }
    },
    hideSlider: Boolean,
    iconsAndText: Boolean,
    mobileBreakPoint: {
      type: [Number, String],
      default: 1264,
      validator: function validator(v) {
        return !isNaN(parseInt(v));
      }
    },
    nextIcon: {
      type: String,
      default: '$vuetify.icons.next'
    },
    prevIcon: {
      type: String,
      default: '$vuetify.icons.prev'
    },
    right: Boolean,
    showArrows: Boolean,
    sliderColor: {
      type: String,
      default: 'accent'
    },
    value: [Number, String]
  }
};