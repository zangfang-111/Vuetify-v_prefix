'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_sliders.styl');

var _helpers = require('../../util/helpers');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _input = require('../../mixins/input');

var _input2 = _interopRequireDefault(_input);

var _clickOutside = require('../../directives/click-outside');

var _clickOutside2 = _interopRequireDefault(_clickOutside);

var _transitions = require('../transitions');

var _console = require('../../util/console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-slider',

  mixins: [_colorable2.default, _input2.default],

  directives: { ClickOutside: _clickOutside2.default },

  data: function data() {
    return {
      app: {},
      defaultColor: 'primary',
      isActive: false,
      keyPressed: 0
    };
  },


  props: {
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    step: {
      type: [Number, String],
      default: 1
    },
    ticks: Boolean,
    thumbColor: {
      type: String,
      default: null
    },
    thumbLabel: Boolean,
    trackColor: {
      type: String,
      default: null
    },
    value: [Number, String]
  },

  computed: {
    classes: function classes() {
      return {
        'input-group--slider': true,
        'input-group--active': this.isActive,
        'input-group--dirty': this.inputWidth > 0,
        'input-group--disabled': this.disabled,
        'input-group--ticks': !this.disabled && this.stepNumeric && this.ticks
      };
    },
    computedColor: function computedColor() {
      return this.disabled ? null : this.color || this.defaultColor;
    },
    computedTrackColor: function computedTrackColor() {
      return this.disabled ? null : this.trackColor || null;
    },
    computedThumbColor: function computedThumbColor() {
      return this.disabled || !this.inputWidth ? null : this.thumbColor || this.color || this.defaultColor;
    },
    stepNumeric: function stepNumeric() {
      return this.step > 0 ? parseFloat(this.step) : 0;
    },

    inputValue: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        var min = this.min,
            max = this.max;

        val = Math.min(Math.max(val, min), max);

        // Round value to ensure the
        // entire slider range can
        // be selected with step
        var value = this.roundValue(val);
        this.lazyValue = value;

        if (value !== this.value) {
          this.$emit('input', value);
        }
      }
    },
    interval: function interval() {
      return 100 / (this.max - this.min) * this.stepNumeric;
    },
    thumbStyles: function thumbStyles() {
      return {
        transition: this.keyPressed >= 2 ? 'none' : '',
        left: this.inputWidth + '%'
      };
    },
    tickContainerStyles: function tickContainerStyles() {
      return {
        transform: 'translate(0, -50%)'
      };
    },
    trackPadding: function trackPadding() {
      if (this.thumbLabel && this.isActive) return 0;

      return 6 + (this.isActive && !this.disabled ? 3 : 0);
    },
    trackStyles: function trackStyles() {
      return {
        transition: this.keyPressed >= 2 ? 'none' : '',
        left: 'calc(' + this.inputWidth + '% + ' + this.trackPadding + 'px)',
        width: 'calc(' + (100 - this.inputWidth) + '% - ' + this.trackPadding + 'px)'
      };
    },
    trackFillStyles: function trackFillStyles() {
      return {
        transition: this.keyPressed >= 2 ? 'none' : '',
        width: 'calc(' + this.inputWidth + '% - ' + this.trackPadding + 'px)'
      };
    },
    numTicks: function numTicks() {
      return Math.ceil((this.max - this.min) / this.stepNumeric);
    },
    inputWidth: function inputWidth() {
      return (this.roundValue(this.inputValue) - this.min) / (this.max - this.min) * 100;
    }
  },

  watch: {
    isActive: function isActive(val) {
      this.isFocused = val;
    },
    min: function min(val) {
      val > this.inputValue && this.$emit('input', parseFloat(val));
    },
    max: function max(val) {
      val < this.inputValue && this.$emit('input', parseFloat(val));
    },
    value: function value(val) {
      this.inputValue = parseFloat(val);
    }
  },

  mounted: function mounted() {
    this.inputValue = this.value;

    // Without a v-app, iOS does not work with body selectors
    this.app = document.querySelector('[data-app]') || (0, _console.consoleWarn)('Missing v-app or a non-body wrapping element with the [data-app] attribute', this);
  },


  methods: {
    onMouseDown: function onMouseDown(e) {
      this.keyPressed = 2;
      var options = { passive: true };
      this.isActive = true;

      if ('touches' in e) {
        this.app.addEventListener('touchmove', this.onMouseMove, options);
        (0, _helpers.addOnceEventListener)(this.app, 'touchend', this.onMouseUp);
      } else {
        this.app.addEventListener('mousemove', this.onMouseMove, options);
        (0, _helpers.addOnceEventListener)(this.app, 'mouseup', this.onMouseUp);
      }
    },
    onMouseUp: function onMouseUp() {
      this.keyPressed = 0;
      var options = { passive: true };
      this.isActive = false;
      this.app.removeEventListener('touchmove', this.onMouseMove, options);
      this.app.removeEventListener('mousemove', this.onMouseMove, options);
    },
    onMouseMove: function onMouseMove(e) {
      var _$refs$track$getBound = this.$refs.track.getBoundingClientRect(),
          offsetLeft = _$refs$track$getBound.left,
          trackWidth = _$refs$track$getBound.width;

      var clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      var left = Math.min(Math.max((clientX - offsetLeft) / trackWidth, 0), 1);

      if (clientX >= offsetLeft - 8 && clientX <= offsetLeft + trackWidth + 8) {
        this.inputValue = parseFloat(this.min) + left * (this.max - this.min);
      }
    },
    onKeyDown: function onKeyDown(e) {
      if (this.disabled || ![33, 34, 35, 36, 37, 39].includes(e.keyCode)) return;

      e.preventDefault();
      var step = this.stepNumeric || 1;
      var steps = (this.max - this.min) / step;
      if (e.keyCode === 37 || e.keyCode === 39) {
        // Left/right
        this.keyPressed += 1;

        var direction = e.keyCode === 37 ? -1 : 1;
        var multiplier = e.shiftKey ? 3 : e.ctrlKey ? 2 : 1;

        this.inputValue = this.inputValue + direction * step * multiplier;
      } else if (e.keyCode === 36) {
        // Home
        this.inputValue = parseFloat(this.min);
      } else if (e.keyCode === 35) {
        // End
        this.inputValue = parseFloat(this.max);
      } else /* if (e.keyCode === 33 || e.keyCode === 34) */{
          // Page up/down
          var _direction = e.keyCode === 34 ? -1 : 1;
          this.inputValue = this.inputValue - _direction * step * (steps > 100 ? steps / 10 : 10);
        }
    },
    onKeyUp: function onKeyUp() {
      this.keyPressed = 0;
    },
    sliderMove: function sliderMove(e) {
      if (!this.isActive) {
        this.onMouseMove(e);
      }
    },
    genThumbLabel: function genThumbLabel(h) {
      return h(_transitions.VScaleTransition, {
        props: { origin: 'bottom center' }
      }, [h('div', {
        staticClass: 'v-slider__thumb--label__container',
        directives: [{
          name: 'show',
          value: this.isActive
        }]
      }, [h('div', {
        staticClass: 'v-slider__thumb--label',
        'class': this.addBackgroundColorClassChecks({}, this.computedThumbColor)
      }, [h('span', {}, this.inputValue)])])]);
    },
    roundValue: function roundValue(value) {
      if (!this.stepNumeric) {
        return value;
      }

      // Format input value using the same number
      // of decimals places as in the step prop
      var trimmedStep = this.step.toString().trim();
      var decimals = trimmedStep.indexOf('.') > -1 ? trimmedStep.length - trimmedStep.indexOf('.') - 1 : 0;
      return 1 * (Math.round(value / this.stepNumeric) * this.stepNumeric).toFixed(decimals);
    },
    genThumbContainer: function genThumbContainer(h) {
      var children = [];
      children.push(h('div', {
        staticClass: 'v-slider__thumb',
        'class': this.addBackgroundColorClassChecks({}, this.computedThumbColor)
      }));

      this.thumbLabel && children.push(this.genThumbLabel(h));

      return h('div', {
        staticClass: 'v-slider__thumb-container',
        'class': {
          'v-slider__thumb-container--label': this.thumbLabel
        },
        style: this.thumbStyles,
        on: {
          touchstart: this.onMouseDown,
          mousedown: this.onMouseDown
        },
        ref: 'thumb'
      }, children);
    },
    genSteps: function genSteps(h) {
      var _this = this;

      var ticks = (0, _helpers.createRange)(this.numTicks + 1).map(function (i) {
        var span = h('span', {
          key: i,
          staticClass: 'v-slider__tick',
          style: {
            left: i * (100 / _this.numTicks) + '%'
          }
        });

        return span;
      });

      return h('div', {
        staticClass: 'v-slider__ticks-container',
        style: this.tickContainerStyles
      }, ticks);
    },
    genTrackContainer: function genTrackContainer(h) {
      var children = [h('div', {
        staticClass: 'v-slider__track',
        'class': this.addBackgroundColorClassChecks({}, this.computedTrackColor),
        style: this.trackStyles
      }), h('div', {
        staticClass: 'v-slider__track-fill',
        'class': this.addBackgroundColorClassChecks(),
        style: this.trackFillStyles
      })];

      return h('div', {
        staticClass: 'v-slider__track__container',
        ref: 'track'
      }, children);
    }
  },

  render: function render(h) {
    var _this2 = this;

    var children = [];

    children.push(this.genTrackContainer(h));
    this.step && this.ticks && children.push(this.genSteps(h));
    children.push(this.genThumbContainer(h));

    var slider = h('div', {
      staticClass: 'v-slider'
    }, children);

    return this.genInputGroup([slider], {
      attrs: {
        role: 'slider',
        tabindex: this.disabled ? -1 : this.tabindex
      },
      on: Object.assign({}, {
        mouseup: this.sliderMove,
        keydown: this.onKeyDown,
        keyup: this.onKeyUp
      }, this.$listeners),
      directives: [{
        name: 'click-outside',
        value: function value() {
          return _this2.isActive = false;
        }
      }]
    });
  }
};