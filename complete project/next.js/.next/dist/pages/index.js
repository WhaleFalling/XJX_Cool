'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('_babel-runtime@6.26.0@babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _regenerator = require('_babel-runtime@6.26.0@babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('_babel-runtime@6.26.0@babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('_babel-runtime@6.26.0@babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('_babel-runtime@6.26.0@babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('_babel-runtime@6.26.0@babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('_babel-runtime@6.26.0@babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _link = require('_next@4.1.3@next\\dist\\lib\\link.js');

var _link2 = _interopRequireDefault(_link);

var _head = require('_next@4.1.3@next\\dist\\lib\\head.js');

var _head2 = _interopRequireDefault(_head);

require('isomorphic-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'C:\\Users\\dell\\Desktop\\\u4E8C\u7EC4\\next.js\\pages\\index.js?entry';


var _class = function (_React$Component) {
  (0, _inherits3.default)(_class, _React$Component);

  (0, _createClass3.default)(_class, null, [{
    key: 'getInitialProps',

    //第一次载入加载数据
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
        var pathname = _ref.pathname,
            query = _ref.query,
            asPath = _ref.asPath,
            req = _ref.req,
            res = _ref.res,
            jsonPageRes = _ref.jsonPageRes,
            err = _ref.err;
        var view_width, data, list;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!req) {
                  view_width = window.width;

                  alert("这是前端");
                }
                console.log(pathname, query, asPath, req, res, jsonPageRes, err);

                _context.next = 4;
                return fetch("http://localhost:3000/list", {
                  method: 'get',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });

              case 4:
                data = _context.sent;
                _context.next = 7;
                return data.json();

              case 7:
                list = _context.sent;
                return _context.abrupt('return', {
                  photoList: list

                  // .then((response) => {
                  //   if (response.status == 200) {
                  //     return response;
                  //   } else {
                  //     throw { message: response.statusText, status: response.status };
                  //   }
                  // }).then((response) => {
                  //   return response.json();
                  // }).then((json) => {
                  //   resolve(json);
                  // }).catch((err) => {
                  //   reject(err);
                  // });
                });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getInitialProps(_x) {
        return _ref2.apply(this, arguments);
      }

      return getInitialProps;
    }()
  }]);

  function _class(props) {
    (0, _classCallCheck3.default)(this, _class);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this));

    _this.state = {
      photoList: props.photoList,
      activeIndex: 0
    };
    return _this;
  }

  (0, _createClass3.default)(_class, [{
    key: 'handler_click',
    value: function handler_click() {
      this.setState({ count: this.state.count + 1 });
    }
  }, {
    key: 'go_index',
    value: function go_index(n) {
      this.setState({ activeIndex: n });
    }
  }, {
    key: 'handler_go_prev',
    value: function handler_go_prev() {
      this.state.activeIndex > 0 && this.go_index(this.state.activeIndex - 1);
    }
  }, {
    key: 'handler_go_next',
    value: function handler_go_next() {
      this.state.activeIndex < this.state.photoList.length - 1 && this.go_index(this.state.activeIndex + 1);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', { className: 'mobile_ppt', __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      }, _react2.default.createElement(_head2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        }
      }, _react2.default.createElement('meta', { charset: 'utf-8', __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }), _react2.default.createElement('title', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        }
      }, '\u4E8C\u7EC4\u7EC3\u4E60\u7528'), _react2.default.createElement('link', { rel: 'stylesheet', type: 'text/css', href: 'css/ppt.css', __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        }
      }), _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no', __source: {
          fileName: _jsxFileName,
          lineNumber: 79
        }
      })), _react2.default.createElement('ul', { className: 'section_list', __source: {
          fileName: _jsxFileName,
          lineNumber: 81
        }
      }, this.state.photoList.map(function (v, k) {
        var index_class = k == _this2.state.activeIndex ? 'active' : _this2.state.activeIndex > k ? 'prev' : 'next';
        console.log(index_class);
        return _react2.default.createElement('li', { key: k, className: 'section ' + index_class, __source: {
            fileName: _jsxFileName,
            lineNumber: 87
          }
        }, _react2.default.createElement('img', { src: 'img/' + v, alt: '', className: 'bg_photo', __source: {
            fileName: _jsxFileName,
            lineNumber: 87
          }
        }));
      })), _react2.default.createElement('span', { className: 'btn_up', onClick: this.handler_go_prev.bind(this), __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        }
      }), _react2.default.createElement('span', { className: 'btn_down', onClick: function onClick() {
          return _this2.handler_go_next();
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        }
      }));
    }
  }]);

  return _class;
}(_react2.default.Component);

// () => (
//   <ul>
//     <li><Link href='/b' as='/a'><a>a</a></Link></li>
//     <li><Link href='/a' as='/b'><a>b</a></Link></li>
//   </ul>
// )


exports.default = _class;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkxpbmsiLCJIZWFkIiwicGF0aG5hbWUiLCJxdWVyeSIsImFzUGF0aCIsInJlcSIsInJlcyIsImpzb25QYWdlUmVzIiwiZXJyIiwidmlld193aWR0aCIsIndpbmRvdyIsIndpZHRoIiwiYWxlcnQiLCJjb25zb2xlIiwibG9nIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiZGF0YSIsImpzb24iLCJsaXN0IiwicGhvdG9MaXN0IiwicHJvcHMiLCJzdGF0ZSIsImFjdGl2ZUluZGV4Iiwic2V0U3RhdGUiLCJjb3VudCIsIm4iLCJnb19pbmRleCIsImxlbmd0aCIsIm1hcCIsInYiLCJrIiwiaW5kZXhfY2xhc3MiLCJoYW5kbGVyX2dvX3ByZXYiLCJiaW5kIiwiaGFuZGxlcl9nb19uZXh0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBTzs7OztBQUNQLEFBQU87Ozs7QUFDUCxBQUFPOzs7O0FBRVA7Ozs7Ozs7Ozs7O1NBTUU7Ozs7O1ksQUFDK0IsZ0IsQUFBQTtZLEFBQVUsYSxBQUFBO1ksQUFBTyxjQUFBLEE7WUFBUSxBLFcsQUFBQTtZQUFLLEEsV0FBQSxBO1lBQUssQSxtQkFBQSxBO1ksQUFBYSxXQUFBLEE7Ozs7O21CQUM3RTtvQkFBRyxDQUFILEFBQUksS0FBSSxBQUNGO0FBREUsK0JBQ1MsT0FEVCxBQUNnQixBQUN0Qjs7d0JBQUEsQUFBTSxBQUNQO0FBQ0Q7d0JBQUEsQUFBUSxJQUFSLEFBQVksVUFBWixBQUFzQixPQUF0QixBQUE2QixRQUE3QixBQUFxQyxLQUFyQyxBQUEwQyxLQUExQyxBQUErQyxhQUEvQyxBQUE0RDs7OzZCQUUzQyxBQUFNOzBCQUE4QixBQUMzQyxBQUNSOztvQyxBQUZlLEFBQW9DLEFBRTFDLEFBQ1M7QUFEVCxBQUNQO0FBSGlELEFBQ25ELGlCQURlOzttQkFBYjtBOzt1QkFPYSxLQUFBLEFBQUssQTs7bUJBQWxCO0E7OzZCQUlTLEFBR2I7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJPLEE7QUFBQSxBQUNMOzs7Ozs7Ozs7Ozs7Ozs7QUFrQko7OztrQkFBQSxBQUFZLE9BQU87d0NBQUE7O2dJQUVqQjs7VUFBQSxBQUFLO2lCQUNRLE1BREEsQUFDTSxBQUNqQjttQkFKZSxBQUVqQixBQUFhLEFBRUU7QUFGRixBQUNYO1dBR0g7Ozs7O29DQUVlLEFBQ2Q7V0FBQSxBQUFLLFNBQVMsRUFBRSxPQUFPLEtBQUEsQUFBSyxNQUFMLEFBQVcsUUFBbEMsQUFBYyxBQUE0QixBQUMzQzs7Ozs2QkFFUSxBLEdBQUcsQUFDVjtXQUFBLEFBQUssU0FBUyxFQUFFLGFBQWhCLEFBQWMsQUFBZSxBQUM5Qjs7OztzQ0FFaUIsQUFDaEI7V0FBQSxBQUFLLE1BQUwsQUFBVyxjQUFYLEFBQXlCLEtBQUssS0FBQSxBQUFLLFNBQVMsS0FBQSxBQUFLLE1BQUwsQUFBVyxjQUF2RCxBQUE4QixBQUF1QyxBQUN0RTs7OztzQ0FFaUIsQUFDaEI7V0FBQSxBQUFLLE1BQUwsQUFBVyxjQUFjLEtBQUEsQUFBSyxNQUFMLEFBQVcsVUFBWCxBQUFxQixTQUE5QyxBQUFxRCxLQUFLLEtBQUEsQUFBSyxTQUFTLEtBQUEsQUFBSyxNQUFMLEFBQVcsY0FBbkYsQUFBMEQsQUFBdUMsQUFDbEc7Ozs7NkJBRVE7bUJBQ1A7OzZCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO09BQUEsa0JBQ0UsQUFBQzs7b0JBQUQ7c0JBQUEsQUFDRTtBQURGO0FBQUEsaURBQ1EsU0FBTixBQUFjO29CQUFkO3NCQURGLEFBQ0UsQUFDQTtBQURBOzBCQUNBLGNBQUE7O29CQUFBO3NCQUFBO0FBQUE7QUFBQSxTQUZGLEFBRUUsQUFDQSwyRUFBTSxLQUFOLEFBQVUsY0FBYSxNQUF2QixBQUE0QixZQUFXLE1BQXZDLEFBQTRDO29CQUE1QztzQkFIRixBQUdFLEFBQ0E7QUFEQTtrREFDTSxNQUFOLEFBQVcsWUFBVyxTQUF0QixBQUE4QjtvQkFBOUI7c0JBTEosQUFDRSxBQUlFLEFBRUY7QUFGRTsyQkFFRixjQUFBLFFBQUksV0FBSixBQUFjO29CQUFkO3NCQUFBLEFBRUk7QUFGSjtjQUVJLEFBQUssTUFBTCxBQUFXLFVBQVgsQUFBcUIsSUFBSSxVQUFBLEFBQUMsR0FBRCxBQUFJLEdBQU0sQUFDakM7WUFBSSxjQUFjLEtBQUssT0FBQSxBQUFLLE1BQVYsQUFBZ0IsY0FBaEIsQUFBOEIsV0FBWSxPQUFBLEFBQUssTUFBTCxBQUFXLGNBQVgsQUFBeUIsSUFBekIsQUFBNkIsU0FBekYsQUFBa0csQUFDbEc7Z0JBQUEsQUFBUSxJQUFSLEFBQVksQUFDWjsrQkFDRSxjQUFBLFFBQUksS0FBSixBQUFTLEdBQUcsd0JBQVosQUFBa0M7c0JBQWxDO3dCQUFBLEFBQWlEO0FBQWpEO1NBQUEseUNBQXNELGNBQUwsQUFBaUIsR0FBSyxLQUF0QixBQUEwQixJQUFHLFdBQTdCLEFBQXVDO3NCQUF2Qzt3QkFEbkQsQUFDRSxBQUFpRCxBQUdwRDtBQUhvRDs7QUFiM0QsQUFPRSxBQUVJLEFBVUosbURBQU0sV0FBTixBQUFnQixVQUFTLFNBQVMsS0FBQSxBQUFLLGdCQUFMLEFBQXFCLEtBQXZELEFBQWtDLEFBQTBCO29CQUE1RDtzQkFuQkYsQUFtQkUsQUFDQTtBQURBO2tEQUNNLFdBQU4sQUFBZ0IsWUFBVyxTQUFTLG1CQUFBO2lCQUFNLE9BQU4sQUFBTSxBQUFLO0FBQS9DO29CQUFBO3NCQXJCSixBQUNFLEFBb0JFLEFBR0w7QUFISzs7Ozs7O0VBdEZxQixnQkFBTSxBOztBQThGbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzP2VudHJ5Iiwic291cmNlUm9vdCI6IkM6XFxVc2Vyc1xcZGVsbFxcRGVza3RvcFxc5LqM57uEXFxuZXh0LmpzIn0=