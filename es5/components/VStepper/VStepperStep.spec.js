'use strict';

var _testing = require('@util/testing');

var _VStepperStep = require('./VStepperStep');

var _VStepperStep2 = _interopRequireDefault(_VStepperStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(0, _testing.test)('VStepperStep.js', function (_ref) {
  var mount = _ref.mount;

  it('should accept a custom color', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var wrapper;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wrapper = mount(_VStepperStep2.default, {
              attachToDocument: true,
              propsData: {
                color: 'pink',
                complete: true
              }
            });


            expect(wrapper.html()).toMatchSnapshot();
            expect('[Vue warn]: Injection "stepClick" not found').toHaveBeenWarned();

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});