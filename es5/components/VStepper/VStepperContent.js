'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transitions = require('../transitions');

exports.default = {
  name: 'v-stepper-content',

  data: function data() {
    return {
      height: 0,
      // Must be null to allow
      // previous comparison
      isActive: null,
      isReverse: false,
      isVertical: false
    };
  },


  props: {
    step: {
      type: [Number, String],
      required: true
    }
  },

  computed: {
    classes: function classes() {
      return {
        'v-stepper__content': true
      };
    },
    computedTransition: function computedTransition() {
      return this.isReverse ? _transitions.VTabReverseTransition : _transitions.VTabTransition;
    },
    styles: function styles() {
      if (!this.isVertical) return {};

      return {
        height: !isNaN(this.height) ? this.height + 'px' : this.height
      };
    },
    wrapperClasses: function wrapperClasses() {
      return {
        'v-stepper__wrapper': true
      };
    }
  },

  watch: {
    isActive: function isActive(current, previous) {
      // If active and the previous state
      // was null, is just booting up
      if (current && previous == null) {
        return this.height = 'auto';
      }

      if (!this.isVertical) return;

      if (this.isActive) this.enter();else this.leave();
    }
  },

  mounted: function mounted() {
    this.$refs.wrapper.addEventListener('transitionend', this.onTransition, false);
  },
  beforeDestroy: function beforeDestroy() {
    this.$refs.wrapper.removeEventListener('transitionend', this.onTransition, false);
  },


  methods: {
    onTransition: function onTransition(e) {
      if (!this.isActive || e.propertyName !== 'height') return;

      this.height = 'auto';
    },
    enter: function enter() {
      var _this = this;

      var scrollHeight = 0;

      // Render bug with height
      requestAnimationFrame(function () {
        scrollHeight = _this.$refs.wrapper.scrollHeight;
      });

      this.height = 0;

      // Give the collapsing element time to collapse
      setTimeout(function () {
        return _this.height = scrollHeight || 'auto';
      }, 450);
    },
    leave: function leave() {
      var _this2 = this;

      this.height = this.$refs.wrapper.clientHeight;
      setTimeout(function () {
        return _this2.height = 0;
      }, 10);
    },
    toggle: function toggle(step, reverse) {
      this.isActive = step.toString() === this.step.toString();
      this.isReverse = reverse;
    }
  },

  render: function render(h) {
    var contentData = {
      'class': this.classes
    };
    var wrapperData = {
      'class': this.wrapperClasses,
      style: this.styles,
      ref: 'wrapper'
    };

    if (!this.isVertical) {
      contentData.directives = [{
        name: 'show',
        value: this.isActive
      }];
    }

    var wrapper = h('div', wrapperData, [this.$slots.default]);
    var content = h('div', contentData, [wrapper]);

    return h(this.computedTransition, {
      on: this.$listeners
    }, [content]);
  }
};