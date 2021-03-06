'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Components


// Mixins


// Utils


var _VTimePickerTitle = require('./VTimePickerTitle');

var _VTimePickerTitle2 = _interopRequireDefault(_VTimePickerTitle);

var _VTimePickerClock = require('./VTimePickerClock');

var _VTimePickerClock2 = _interopRequireDefault(_VTimePickerClock);

var _picker = require('../../mixins/picker');

var _picker2 = _interopRequireDefault(_picker);

var _helpers = require('../../util/helpers');

var _pad = require('../VDatePicker/util/pad');

var _pad2 = _interopRequireDefault(_pad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rangeHours24 = (0, _helpers.createRange)(24);
var rangeHours12am = (0, _helpers.createRange)(12);
var rangeHours12pm = rangeHours12am.map(function (v) {
  return v + 12;
});
var rangeMinutes = (0, _helpers.createRange)(60);

exports.default = {
  name: 'v-time-picker',

  mixins: [_picker2.default],

  data: function data() {
    return {
      inputHour: null,
      inputMinute: null,
      period: 'am',
      selectingHour: true
    };
  },


  props: {
    allowedHours: Function,
    allowedMinutes: Function,
    format: {
      type: String,
      default: 'ampm',
      validator: function validator(val) {
        return ['ampm', '24hr'].includes(val);
      }
    },
    min: String,
    max: String,
    scrollable: Boolean,
    value: null
  },

  computed: {
    isAllowedHourCb: function isAllowedHourCb() {
      var _this = this;

      if (!this.min && !this.max) return this.allowedHours;

      var minHour = this.min ? this.min.split(':')[0] : 0;
      var maxHour = this.max ? this.max.split(':')[0] : 23;

      return function (val) {
        return val >= minHour * 1 && val <= maxHour * 1 && (!_this.allowedHours || _this.allowedHours(val));
      };
    },
    isAllowedMinuteCb: function isAllowedMinuteCb() {
      var _this2 = this;

      var isHourAllowed = !this.allowedHours || this.allowedHours(this.inputHour);
      if (!this.min && !this.max) {
        return isHourAllowed ? this.allowedMinutes : function () {
          return false;
        };
      }

      var _ref = this.min ? this.min.split(':') : [0, 0],
          _ref2 = _slicedToArray(_ref, 2),
          minHour = _ref2[0],
          minMinute = _ref2[1];

      var _ref3 = this.max ? this.max.split(':') : [23, 59],
          _ref4 = _slicedToArray(_ref3, 2),
          maxHour = _ref4[0],
          maxMinute = _ref4[1];

      var minTime = minHour * 60 + minMinute * 1;
      var maxTime = maxHour * 60 + maxMinute * 1;

      return function (val) {
        var time = 60 * _this2.inputHour + val;
        return time >= minTime && time <= maxTime && isHourAllowed && (!_this2.allowedMinutes || _this2.allowedMinutes(val));
      };
    },
    isAmPm: function isAmPm() {
      return this.format === 'ampm';
    }
  },

  watch: {
    value: 'setInputData'
  },

  methods: {
    emitValue: function emitValue() {
      if (this.inputHour != null && this.inputMinute != null) {
        this.$emit('input', (0, _pad2.default)(this.inputHour) + ':' + (0, _pad2.default)(this.inputMinute));
      }
    },
    setPeriod: function setPeriod(period) {
      this.period = period;
      if (this.inputHour != null) {
        var newHour = this.inputHour + (period === 'am' ? -12 : 12);
        this.inputHour = this.firstAllowed('hour', newHour);
        this.emitValue();
      }
    },
    setInputData: function setInputData(value) {
      if (value == null) {
        this.inputHour = null;
        this.inputMinute = null;
        return;
      }

      if (value instanceof Date) {
        this.inputHour = value.getHours();
        this.inputMinute = value.getMinutes();
      } else {
        var _ref5 = value.trim().toLowerCase().match(/^(\d+):(\d+)(:\d+)?([ap]m)?$/, '') || [],
            _ref6 = _slicedToArray(_ref5, 5),
            hour = _ref6[1],
            minute = _ref6[2],
            period = _ref6[4];

        this.inputHour = period ? this.convert12to24(parseInt(hour, 10), period) : parseInt(hour, 10);
        this.inputMinute = parseInt(minute, 10);
      }

      this.period = this.inputHour < 12 ? 'am' : 'pm';
    },
    convert24to12: function convert24to12(hour) {
      return hour ? (hour - 1) % 12 + 1 : 12;
    },
    convert12to24: function convert12to24(hour, period) {
      return hour % 12 + (period === 'pm' ? 12 : 0);
    },
    onInput: function onInput(value) {
      if (this.selectingHour) {
        this.inputHour = this.isAmPm ? this.convert12to24(value, this.period) : value;
      } else {
        this.inputMinute = value;
      }
      this.emitValue();
    },
    onChange: function onChange() {
      if (!this.selectingHour) {
        this.$emit('change', this.value);
      }

      this.selectingHour = !this.selectingHour;
    },
    firstAllowed: function firstAllowed(type, value) {
      var allowedFn = type === 'hour' ? this.isAllowedHourCb : this.isAllowedMinuteCb;
      if (!allowedFn) return value;

      // TODO: clean up
      var range = type === 'minute' ? rangeMinutes : this.isAmPm ? value < 12 ? rangeHours12am : rangeHours12pm : rangeHours24;
      var first = range.find(function (v) {
        return allowedFn((v + value) % range.length + range[0]);
      });
      return ((first || 0) + value) % range.length + range[0];
    },
    genClock: function genClock() {
      return this.$createElement(_VTimePickerClock2.default, {
        props: {
          allowedValues: this.selectingHour ? this.isAllowedHourCb : this.isAllowedMinuteCb,
          color: this.color,
          dark: this.dark,
          double: this.selectingHour && !this.isAmPm,
          format: this.selectingHour ? this.isAmPm ? this.convert24to12 : function (val) {
            return val;
          } : function (val) {
            return (0, _pad2.default)(val, 2);
          },
          max: this.selectingHour ? this.isAmPm && this.period === 'am' ? 11 : 23 : 59,
          min: this.selectingHour && this.isAmPm && this.period === 'pm' ? 12 : 0,
          scrollable: this.scrollable,
          size: this.width - (!this.fullWidth && this.landscape ? 80 : 20),
          step: this.selectingHour ? 1 : 5,
          value: this.selectingHour ? this.inputHour : this.inputMinute
        },
        on: {
          input: this.onInput,
          change: this.onChange
        },
        ref: 'clock'
      });
    },
    genPickerBody: function genPickerBody() {
      return this.$createElement('div', {
        staticClass: 'v-time-picker-clock__container',
        style: {
          width: this.width + 'px',
          height: this.width - (!this.fullWidth && this.landscape ? 60 : 0) + 'px'
        },
        key: this.selectingHour
      }, [this.genClock()]);
    },
    genPickerTitle: function genPickerTitle() {
      var _this3 = this;

      return this.$createElement(_VTimePickerTitle2.default, {
        props: {
          ampm: this.isAmPm,
          hour: this.inputHour,
          minute: this.inputMinute,
          period: this.period,
          selectingHour: this.selectingHour
        },
        on: {
          'update:selectingHour': function updateSelectingHour(value) {
            return _this3.selectingHour = value;
          },
          'update:period': this.setPeriod
        },
        ref: 'title',
        slot: 'title'
      });
    }
  },

  mounted: function mounted() {
    this.setInputData(this.value);
  },
  render: function render() {
    return this.genPicker('v-picker--time');
  }
};