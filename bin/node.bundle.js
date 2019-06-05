module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "C:\\Users\\AranM\\Projects\\botpress-10\\Botpress-Messenger";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var handlePromise = function handlePromise(next, promise) {
  return promise.then(function (res) {
    next();
    return res;
  }).catch(function (err) {
    next(err);
    throw err;
  });
};

var handleText = function handleText(event, next, messenger) {
  return handlePromise(next, messenger.sendTextMessage(event.raw.to, event.raw.message, event.raw.quick_replies, event.raw));
};

var handleAttachment = function handleAttachment(event, next, messenger) {
  return handlePromise(next, messenger.sendAttachment(event.raw.to, event.raw.type, event.raw.url, event.raw.quick_replies, event.raw));
};

var handleTemplate = function handleTemplate(event, next, messenger) {
  return handlePromise(next, messenger.sendTemplate(event.raw.to, event.raw.payload, event.raw));
};

var handleTyping = function handleTyping(event, next, messenger) {
  return handlePromise(next, messenger.sendTypingIndicator(event.raw.to, event.raw.typing));
};

var handleSeen = function handleSeen(event, next, messenger) {
  return handlePromise(next, messenger.sendAction(event.raw.to, 'mark_seen'));
};

module.exports = {
  text: handleText,
  attachment: handleAttachment,
  template: handleTemplate,
  typing: handleTyping,
  seen: handleSeen,
  pending: {}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _botpress = __webpack_require__(8);

var knex = null;

function initialize() {
  if (!knex) {
    throw new Error('you must initialize the database before');
  }

  return (0, _botpress.DatabaseHelpers)(knex).createTableIfNotExists('messenger_attachments', function (table) {
    table.string('url').primary();
    table.string('attachment_id');
  }).then();
}

function addAttachment(url, attachment_id) {
  return knex('messenger_attachments').insert({ url: url, attachment_id: attachment_id }).then().get(0);
}

function getAttachment(url) {
  return knex('messenger_attachments').where('url', url).select('attachment_id').then().get(0).then(function (ret) {
    return ret && ret.attachment_id;
  });
}

function hasAttachment(url) {
  return knex('messenger_attachments').where('url', url).count('url as count').then(function (ret) {
    return ret && ret[0] && (ret[0].count === "1" || ret[0].count === 1);
  });
}

module.exports = function (k) {
  knex = k;
  return { initialize: initialize, addAttachment: addAttachment, getAttachment: getAttachment, hasAttachment: hasAttachment };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _ = __webpack_require__(0);

module.exports = function (bp, messenger) {
  var getOrFetchUserProfile = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId) {
      var knex, user, profile;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return bp.db.get();

            case 2:
              knex = _context.sent;
              _context.next = 5;
              return knex('users').where({ platform: 'facebook', userId: userId }).then().get(0).then();

            case 5:
              user = _context.sent;

              if (!user) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return', dbEntryToProfile(user));

            case 8:
              _context.t0 = Object;
              _context.next = 11;
              return messenger.getUserProfile(userId);

            case 11:
              _context.t1 = _context.sent;
              _context.t2 = { id: userId };
              profile = _context.t0.assign.call(_context.t0, _context.t1, _context.t2);
              _context.next = 16;
              return bp.db.saveUser(profileToDbEntry(profile));

            case 16:
              return _context.abrupt('return', profile);

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function getOrFetchUserProfile(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var getAllUsers = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var knex, users;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return bp.db.get();

            case 2:
              knex = _context2.sent;
              _context2.next = 5;
              return knex('users').where({ platform: 'facebook' }).then();

            case 5:
              users = _context2.sent;
              return _context2.abrupt('return', (users || []).map(dbEntryToProfile));

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function getAllUsers() {
      return _ref2.apply(this, arguments);
    };
  }();

  function profileToDbEntry(profile) {
    return {
      id: /**'facebook:' + */profile.id,
      //userId: profile.id,
      platform: 'facebook',
      gender: profile.gender,
      timezone: profile.timezone,
      locale: profile.locale,
      picture_url: profile.profile_pic,
      first_name: profile.first_name,
      last_name: profile.last_name
    };
  }

  function dbEntryToProfile(db) {
    return {
      gender: db.gender,
      timezone: db.timezone,
      locale: db.locale,
      profile_pic: db.picture_url,
      first_name: db.first_name,
      last_name: db.last_name,
      userId: db.userId,
      id: db.id
    };
  }

  return { getOrFetchUserProfile: getOrFetchUserProfile, getAllUsers: getAllUsers };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _messenger = __webpack_require__(7);

var _messenger2 = _interopRequireDefault(_messenger);

var _outgoing = __webpack_require__(1);

var _outgoing2 = _interopRequireDefault(_outgoing);

var _incoming = __webpack_require__(13);

var _incoming2 = _interopRequireDefault(_incoming);

var _users = __webpack_require__(4);

var _users2 = _interopRequireDefault(_users);

var _umm = __webpack_require__(15);

var _umm2 = _interopRequireDefault(_umm);

var _db = __webpack_require__(2);

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var messenger = null;
var outgoingPending = _outgoing2.default.pending;

var users = null;

var outgoingMiddleware = function outgoingMiddleware(event, next) {
  if (event.platform !== 'facebook') {
    return next();
  }

  if (!_outgoing2.default[event.type]) {
    return next('Unsupported event type: ' + event.type);
  }

  var setValue = function setValue(method) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (event.__id && outgoingPending[event.__id]) {
        if (args && args[0] && args[0].message_id) {
          outgoingPending[event.__id].timestamp = new Date().getTime() - 1000;
          outgoingPending[event.__id].mid = args[0].message_id;
        }

        if (method === 'resolve' && (event.raw.waitDelivery || event.raw.waitRead)) {
          // We skip setting this value because we wait
        } else {
          outgoingPending[event.__id][method].apply(null, args);
          delete outgoingPending[event.__id];
        }
      }
    };
  };

  _outgoing2.default[event.type](event, next, messenger).then(setValue('resolve'), setValue('reject'));
};

var initializeMessenger = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bp, configurator) {
    var config, enabled;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return configurator.loadAll();

          case 2:
            config = _context.sent;


            messenger = new _messenger2.default(bp, config);
            users = (0, _users2.default)(bp, messenger);

            enabled = config.enabled;

            if (enabled) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', bp.logger.warn('[Messenger] Connection disabled'));

          case 8:
            return _context.abrupt('return', messenger.connect().then(function () {
              return messenger.updateSettings();
            }).catch(function (err) {
              return bp.logger.error(err);
            }));

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function initializeMessenger(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var hostname = [];
var defaultHostname = process.env.BOTPRESS_URL && process.env.NODE_ENV === 'production' ? (hostname = process.env.BOTPRESS_URL.match(/https:\/\/(.*?)\//)) && hostname[1] : '';

module.exports = {
  config: {
    applicationID: { type: 'string', required: true, default: '', env: 'MESSENGER_APP_ID' },
    accessToken: { type: 'string', required: true, default: '', env: 'MESSENGER_ACCESS_TOKEN' },
    appSecret: { type: 'string', required: true, default: '', env: 'MESSENGER_APP_SECRET' },
    verifyToken: { type: 'string', required: false, default: '', env: 'MESSENGER_VERIFY_TOKEN' },
    enabled: { type: 'bool', required: true, default: true },
    enableAllProfileFields: { type: 'bool', required: true, default: false },
    hostname: { type: 'string', required: false, default: defaultHostname, env: 'MESSENGER_HOST' },

    graphVersion: { type: 'string', required: true, default: '2.12' },
    displayGetStarted: { type: 'bool', required: false, default: true },
    greetingMessage: { type: 'string', required: false, default: 'Default greeting message' },
    persistentMenu: { type: 'bool', required: false, default: false },
    persistentMenuItems: { type: 'any', required: false, default: [], validation: function validation(v) {
        return _lodash2.default.isArray(v);
      } },
    composerInputDisabled: { type: 'bool', required: false, default: false },
    automaticallyMarkAsRead: { type: 'bool', required: false, default: true },
    targetAudience: { type: 'string', required: true, default: 'openToAll' },
    targetAudienceOpenToSome: { type: 'string', required: false },
    targetAudienceCloseToSome: { type: 'string', required: false },
    trustedDomains: { type: 'any', required: false, default: [], validation: function validation(v) {
        return _lodash2.default.isArray(v);
      } },

    autoResponseOption: { type: 'string', required: false, default: 'autoResponseTextRenderer' },
    autoResponseText: { type: 'string', required: false, default: 'Hello, human!' }, // TODO: unused, remove in v11
    autoResponseTextRenderer: { type: 'string', required: false, default: '#builtin_text' },
    autoResponsePostback: { type: 'string', required: false, default: 'YOUR_POSTBACK' },
    paymentTesters: { type: 'any', required: false, default: [], validation: function validation(v) {
        return _lodash2.default.isArray(v);
      } },
    chatExtensionHomeUrl: { type: 'string', required: false, default: '' },
    chatExtensionInTest: { type: 'bool', required: false, default: true },
    chatExtensionShowShareButton: { type: 'bool', required: false, default: false },
    webhookSubscriptionFields: {
      type: 'any',
      required: true,
      default: ['message_deliveries', 'message_reads', 'messages', 'messaging_optins', 'messaging_postbacks', 'messaging_referrals']
    }
  },

  init: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bp) {
      var knex;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              bp.middlewares.register({
                name: 'messenger.sendMessages',
                type: 'outgoing',
                order: 100,
                handler: outgoingMiddleware,
                module: 'botpress-messenger',
                description: 'Sends out messages that targets platform = messenger.' + ' This middleware should be placed at the end as it swallows events once sent.'
              });

              bp.messenger = {};

              _context2.next = 4;
              return bp.db.get();

            case 4:
              knex = _context2.sent;
              _context2.next = 7;
              return (0, _db2.default)(knex).initialize();

            case 7:

              (0, _umm2.default)(bp); // Initializes Messenger in the UMM

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function init(_x3) {
      return _ref2.apply(this, arguments);
    }

    return init;
  }(),

  ready: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(bp, config) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return initializeMessenger(bp, config);

            case 2:
              (0, _incoming2.default)(bp, messenger);
              bp.messenger._internal = messenger;

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function ready(_x4, _x5) {
      return _ref3.apply(this, arguments);
    }

    return ready;
  }()
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = __webpack_require__(2);

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Messenger
 *
 * This file contains one class Messenger, which in charge of communication between
 * botpress and fb messenger.
 *
 */

var Promise = __webpack_require__(3);
var EventEmitter = __webpack_require__(9);
var crypto = __webpack_require__(10);
var fetch = __webpack_require__(11);
var _ = __webpack_require__(0);
var bodyParser = __webpack_require__(12);

fetch.promise = Promise;

var normalizeString = function normalizeString(str) {
  return str.replace(/[^a-zA-Z0-9]+/g, '').toUpperCase();
};

var db = null;

var Messenger = function (_EventEmitter) {
  _inherits(Messenger, _EventEmitter);

  function Messenger(bp, config) {
    _classCallCheck(this, Messenger);

    var _this = _possibleConstructorReturn(this, (Messenger.__proto__ || Object.getPrototypeOf(Messenger)).call(this));

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config');
    }

    _this.setConfig(config);
    _this.bp = bp;

    bp.db.get().then(function (k) {
      db = (0, _db2.default)(k);
      db.initialize();
    });

    _this.app = bp.getRouter('botpress-messenger', {
      'bodyParser.json': false,
      auth: function auth(req) {
        return !/\/webhook/i.test(req.originalUrl);
      }
    });

    _this.app.use(bodyParser.json({
      verify: _this._verifyRequestSignature.bind(_this)
    }));

    _this._initWebhook();
    return _this;
  }

  _createClass(Messenger, [{
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = Object.assign({}, this.config, config);
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      return this._setupNewWebhook().then(function () {
        return _this2._subscribePage();
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      return this._unsubscribePage();
    }
  }, {
    key: 'sendTextMessage',
    value: function sendTextMessage(recipientId, text, quickReplies, options) {
      var message = { text: text };
      var formattedQuickReplies = this._formatQuickReplies(quickReplies);
      if (formattedQuickReplies && formattedQuickReplies.length > 0) {
        message.quick_replies = formattedQuickReplies;
      }
      return this.sendMessage(recipientId, message, options);
    }
  }, {
    key: 'sendButtonTemplate',
    value: function sendButtonTemplate(recipientId, text, buttons, options) {
      var payload = {
        template_type: 'button',
        text: text
      };
      var formattedButtons = this._formatButtons(buttons);
      payload.buttons = formattedButtons;

      return this.sendTemplate(recipientId, payload, options);
    }
  }, {
    key: 'sendGenericTemplate',
    value: function sendGenericTemplate(recipientId, elements, options) {
      var payload = {
        template_type: 'generic',
        elements: elements
      };
      return this.sendTemplate(recipientId, payload, options);
    }
  }, {
    key: 'sendTemplate',
    value: function sendTemplate(recipientId, payload, options) {
      var message = {
        attachment: {
          type: 'template',
          payload: payload
        }
      };

      var formattedQuickReplies = this._formatQuickReplies(options.quick_replies);
      if (formattedQuickReplies && formattedQuickReplies.length > 0) {
        message.quick_replies = formattedQuickReplies;
      }

      return this.sendMessage(recipientId, message, options);
    }
  }, {
    key: 'sendAttachment',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(recipientId, type, url, quickReplies, options) {
        var message, attachmentId, formattedQuickReplies;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                message = {
                  attachment: {
                    type: type,
                    payload: {}
                  }
                };


                if (options.isReusable && _.isBoolean(options.isReusable)) {
                  message.attachment.payload.is_reusable = options.isReusable;
                }

                if (!options.attachmentId) {
                  _context.next = 6;
                  break;
                }

                message.attachment.payload = {
                  attachment_id: options.attachmentId
                };
                _context.next = 19;
                break;

              case 6:
                _context.t0 = options.isReusable;

                if (!_context.t0) {
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return db.hasAttachment(url);

              case 10:
                _context.t0 = _context.sent;

              case 11:
                if (!_context.t0) {
                  _context.next = 18;
                  break;
                }

                _context.next = 14;
                return db.getAttachment(url);

              case 14:
                attachmentId = _context.sent;


                message.attachment.payload = {
                  attachment_id: attachmentId
                };
                _context.next = 19;
                break;

              case 18:
                message.attachment.payload.url = url;

              case 19:
                formattedQuickReplies = this._formatQuickReplies(quickReplies);

                if (formattedQuickReplies && formattedQuickReplies.length > 0) {
                  message.quick_replies = formattedQuickReplies;
                }

                return _context.abrupt('return', this.sendMessage(recipientId, message, options).then(function (res) {
                  //NOTE: ATTACHMENT ID is not returned if that was used as part of dispatch.
                  if (res && res.attachment_id) {
                    db.addAttachment(url, res.attachment_id);
                  }
                }));

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sendAttachment(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return sendAttachment;
    }()
  }, {
    key: 'sendAction',
    value: function sendAction(recipientId, action) {
      return this.sendRequest({
        recipient: {
          id: recipientId
        },
        sender_action: action
      });
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(recipientId, message, options) {
      var _this3 = this;

      var req = function req() {
        return _this3.sendRequest({
          recipient: {
            id: recipientId
          },
          message: message
        });
      };
      if (options && options.typing) {
        var autoTimeout = message && message.text ? 500 + message.text.length * 10 : 1000;
        var timeout = typeof options.typing === 'number' ? options.typing : autoTimeout;
        return this.sendTypingIndicator(recipientId, timeout).then(req);
      }

      return req();
    }
  }, {
    key: 'sendValidationRequest',
    value: function sendValidationRequest() {
      var applicationID = this.config.applicationID;
      var accessToken = this.config.accessToken;

      return fetch('https://graph.facebook.com/v' + this.config.graphVersion + '/' + applicationID + '/subscriptions_sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_id: applicationID,
          object: 'page',
          field: 'messages',
          custom_fields: { page_id: applicationID },
          access_token: accessToken
        })
      }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        return console.error("Error sending validation request: ", err);
      });
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(body, endpoint, method) {
      var _this4 = this;

      endpoint = endpoint || 'messages';
      method = method || 'POST';

      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/me/' + endpoint;
      console.log('SENDING: ', url);
      return fetch(url + '?access_token=' + this.config.accessToken, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).then(function (json) {
        _this4._handleEvent('raw_send_request', {
          url: url,
          token: _this4.config.accessToken,
          body: body,
          endpoint: endpoint,
          method: method,
          response: json
        });
        return json;
      }).catch(function (err) {
        return console.error('Error sending request (' + method + ' : ' + url + '):', err, body);
      });
    }
  }, {
    key: 'sendThreadRequest',
    value: function sendThreadRequest(body, method) {
      return this.sendRequest(body, 'thread_settings', method);
    }
  }, {
    key: 'sendTypingIndicator',
    value: function sendTypingIndicator(recipientId, milliseconds) {
      var _this5 = this;

      var timeout = !milliseconds || isNaN(milliseconds) ? 0 : milliseconds;
      timeout = Math.min(20000, timeout);

      if (milliseconds === true) {
        timeout = 1000;
      }

      var before = timeout > 0 ? Promise.resolve(this.sendAction(recipientId, 'typing_on')) : Promise.resolve(true);

      return before.delay(timeout + 1000).then(function () {
        return _this5.sendAction(recipientId, 'typing_off');
      });
    }
  }, {
    key: 'getUserProfile',
    value: function getUserProfile(userId) {
      var token = this.config.accessToken;
      var profileFields = ['first_name', 'last_name', 'profile_pic'].concat(this.config.enableAllProfileFields ? ['locale', 'timezone', 'gender'] : []);
      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/' + userId + '?fields=' + profileFields.join(',') + '&access_token=' + token;

      return fetch(url).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        return console.error('Error getting user profile: ' + err);
      });
    }

    /**
     * Create the settings to add a new chat extension home url
     *
     * Within the context of this app the "show_share" is a boolean
     * but Facebook either wants a
     */

  }, {
    key: 'createChatExtensionHomeUrlSetting',
    value: function createChatExtensionHomeUrlSetting(home_url, in_test, show_share) {
      var show_string = 'hide';
      if (show_share == true) {
        show_string = 'show';
      }

      return {
        home_url: {
          url: home_url,
          webview_height_ratio: 'tall',
          in_test: in_test,
          webview_share_button: show_string
        }
      };
    }
  }, {
    key: 'deleteChatExtensionHomeUrlSetting',
    value: function deleteChatExtensionHomeUrlSetting() {
      return {
        fields: ['home_url']
      };
    }
  }, {
    key: 'deleteChatExtensionHomeUrl',
    value: function deleteChatExtensionHomeUrl() {
      var setting = this.deleteChatExtensionHomeUrlSetting();
      return this.sendRequest(setting, 'messenger_profile', 'DELETE');
    }
  }, {
    key: 'setChatExtensionHomeUrl',
    value: function setChatExtensionHomeUrl(home_url, in_test, show_share) {
      var setting = this.createChatExtensionHomeUrlSetting(home_url, in_test, show_share);
      return this.sendRequest(setting, 'messenger_profile', 'POST');
    }

    // add and delete payment testers from application
    // https://developers.facebook.com/docs/messenger-platform/thread-settings/payment#payment_test_users

  }, {
    key: 'deletePaymentTesterSetting',
    value: function deletePaymentTesterSetting(tester) {
      return {
        setting_type: 'payment',
        payment_dev_mode_action: 'REMOVE',
        payment_testers: [tester]
      };
    }
  }, {
    key: 'createPaymentTesterSetting',
    value: function createPaymentTesterSetting() {
      return {
        setting_type: 'payment',
        payment_dev_mode_action: 'ADD',
        payment_testers: this.config.paymentTesters
      };
    }
  }, {
    key: 'setPaymentTesters',
    value: function setPaymentTesters() {
      if (this.config.paymentTesters.length == 0) {
        return;
      }
      var setting = this.createPaymentTesterSetting();
      return this.sendThreadRequest(setting, 'POST');
    }
  }, {
    key: 'deletePaymentTester',
    value: function deletePaymentTester(tester) {
      var setting = this.deletePaymentTesterSetting(tester);
      return this.sendThreadRequest(setting, 'POST');
    }
  }, {
    key: 'getPageDetails',
    value: function getPageDetails() {
      return this._getPage();
    }
  }, {
    key: 'displayGetStarted',
    value: function displayGetStarted() {
      if (this.config.displayGetStarted) {
        return { type: 'update', field: { name: 'get_started', value: { payload: 'GET_STARTED' } } };
      }

      return { type: 'delete', field: { name: 'get_started' } };
    }
  }, {
    key: 'greetingMessage',
    value: function greetingMessage() {
      var greetingMessage = this.config.greetingMessage;

      var isGreetingMessageEmpty = _.isEmpty(this.config.greetingMessage);

      if (isGreetingMessageEmpty) {
        return { type: 'delete', field: { name: 'greeting' } };
      }

      return {
        type: 'update',
        field: {
          name: 'greeting',
          value: [{
            locale: 'default',
            text: greetingMessage
          }]
        }
      };
    }
  }, {
    key: 'persistentMenu',
    value: function persistentMenu() {
      var _config = this.config,
          composerInputDisabled = _config.composerInputDisabled,
          persistentMenu = _config.persistentMenu,
          persistentMenuItems = _config.persistentMenuItems;


      if (!persistentMenu) {
        return { type: 'delete', field: { name: 'persistent_menu' } };
      }

      return {
        type: 'update',
        field: {
          name: 'persistent_menu',
          value: [{
            // TODO: Support different menus for different locales
            locale: 'default',
            composer_input_disabled: composerInputDisabled,
            call_to_actions: this._formatButtons(this._reformatPersistentMenuItems(persistentMenuItems))
          }]
        }
      };
    }
  }, {
    key: 'targetAudience',
    value: function targetAudience() {
      var _config2 = this.config,
          targetAudience = _config2.targetAudience,
          targetAudienceOpenToSome = _config2.targetAudienceOpenToSome,
          targetAudienceCloseToSome = _config2.targetAudienceCloseToSome;


      switch (targetAudience) {
        case 'openToAll':
          return { type: 'update', field: { name: 'target_audience', value: { audience_type: 'all' } } };
        case 'closeToAll':
          return { type: 'update', field: { name: 'target_audience', value: { audience_type: 'none' } } };
        case 'openToSome':
          return {
            type: 'update',
            field: {
              name: 'target_audience',
              value: {
                audience_type: 'custom',
                countries: {
                  whitelist: targetAudienceOpenToSome.split(/, ?/g)
                }
              }
            }
          };
        case 'closeToSome':
          return {
            type: 'update',
            field: {
              name: 'target_audience',
              value: {
                audience_type: 'custom',
                countries: {
                  blacklist: targetAudienceCloseToSome.split(/, ?/g)
                }
              }
            }
          };
        default:
          return { type: 'update', field: { name: 'target_audience', value: { audience_type: 'all' } } };
      }
    }
  }, {
    key: 'chatExtensionHomeUrl',
    value: function chatExtensionHomeUrl() {
      var _config3 = this.config,
          chatExtensionHomeUrl = _config3.chatExtensionHomeUrl,
          chatExtensionShowShareButton = _config3.chatExtensionShowShareButton,
          chatExtensionInTest = _config3.chatExtensionInTest;


      if (!chatExtensionHomeUrl) {
        return { type: 'delete', field: { name: 'home_url' } };
      }

      return {
        type: 'update',
        field: {
          name: 'home_url',
          value: {
            url: chatExtensionHomeUrl,
            webview_height_ratio: 'tall',
            webview_share_button: chatExtensionShowShareButton ? 'show' : 'hide',
            in_test: chatExtensionInTest
          }
        }
      };
    }
  }, {
    key: 'trustedDomains',
    value: function trustedDomains() {
      var _config4 = this.config,
          trustedDomains = _config4.trustedDomains,
          chatExtensionHomeUrl = _config4.chatExtensionHomeUrl;

      if (!_.isEmpty(chatExtensionHomeUrl) && trustedDomains.indexOf(chatExtensionHomeUrl) === -1) {
        trustedDomains.push(chatExtensionHomeUrl);
      }

      if (_.isEmpty(trustedDomains)) {
        return { type: 'next' };
      }

      return { type: 'update', field: { name: 'whitelisted_domains', value: trustedDomains } };
    }
  }, {
    key: 'paymentTesters',
    value: function paymentTesters() {
      var paymentTesters = this.config.paymentTesters;


      return { type: 'update', field: { name: 'payment_settings', value: { testers: paymentTesters } } };
    }
  }, {
    key: 'updateSettings',
    value: function updateSettings() {
      var _this6 = this;

      var messageConfigKeys = Object.keys(this.config);

      var profileFields = messageConfigKeys.reduce(function (settings, key) {
        if (!_this6[key]) {
          return settings;
        }

        var _key = _this6[key](),
            type = _key.type,
            field = _key.field;

        if (type === 'next') {
          return settings;
        }

        if (type === 'update') {
          settings.update[field.name] = field.value;
        }

        if (type === 'delete') {
          settings.delete.push(field.name);
        }

        return settings;
      }, { update: {}, delete: [] });

      this.sendRequest({ fields: profileFields.delete }, 'messenger_profile', 'DELETE');
      this.sendRequest(profileFields.update, 'messenger_profile', 'POST');
    }
  }, {
    key: 'module',
    value: function module(factory) {
      return factory.apply(this, [this]);
    }
  }, {
    key: '_formatButtons',
    value: function _formatButtons(buttons) {
      return buttons && buttons.map(function (button) {
        if (typeof button === 'string') {
          return {
            type: 'postback',
            title: button,
            payload: 'BUTTON_' + normalizeString(button)
          };
        }
        return button;
      });
    }
  }, {
    key: '_formatQuickReplies',
    value: function _formatQuickReplies(quickReplies) {
      return quickReplies && quickReplies.map(function (reply) {
        if (typeof reply === 'string') {
          return {
            content_type: 'text',
            title: reply,
            payload: 'QR_' + normalizeString(reply)
          };
        } else if (reply && reply.title) {
          return {
            content_type: reply.content_type || 'text',
            title: reply.title,
            payload: reply.payload || 'QR_' + normalizeString(reply.title),
            image_url: reply.image_url
          };
        }
        return reply;
      });
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(type, event) {
      this.emit(type, event);
    }
  }, {
    key: '_handleMessageEvent',
    value: function _handleMessageEvent(event) {
      var text = event.message.text;
      if (!text) {
        return;
      }

      this._handleEvent('message', event);

      if (event.message && this.config.automaticallyMarkAsRead) {
        this.sendAction(event.sender.id, 'mark_seen');
      }
    }
  }, {
    key: '_handleAttachmentEvent',
    value: function _handleAttachmentEvent(event) {
      this._handleEvent('attachment', event);

      if (event.message && this.config.automaticallyMarkAsRead) {
        this.sendAction(event.sender.id, 'mark_seen');
      }
    }
  }, {
    key: '_handlePostbackEvent',
    value: function _handlePostbackEvent(event) {
      var payload = event.postback.payload;
      if (payload) {
        this._handleEvent('postback:' + payload, event);
      }
      this._handleEvent('postback', event);
    }
  }, {
    key: '_handleQuickReplyEvent',
    value: function _handleQuickReplyEvent(event) {
      var payload = event.message.quick_reply && event.message.quick_reply.payload;
      if (payload) {
        this._handleEvent('quick_reply:' + payload, event);
      }
      this._handleEvent('quick_reply', event);

      if (event.message && this.config.automaticallyMarkAsRead) {
        this.sendAction(event.sender.id, 'mark_seen');
      }
    }
  }, {
    key: '_handleFacebookResponse',
    value: function _handleFacebookResponse(res) {
      if (!res) {
        return;
      }

      if (res.status < 400) {
        return res;
      }

      var errorMessage = 'An error has been returned by Facebook API.';
      errorMessage += '\nStatus: ' + res.status + ' (' + res.statusText + ')';

      return Promise.resolve(true).then(function () {
        return res.json && res.json();
      }).then(function (json) {
        errorMessage += '\n' + json.error.message;
        if (json.error.error_user_title) {
          errorMessage += '\n' + json.error.error_user_title;
          errorMessage += '\n' + json.error.error_user_msg;
        }
      }).finally(function () {
        throw new Error(errorMessage);
      });
    }
  }, {
    key: '_initWebhook',
    value: function _initWebhook() {
      var _this7 = this;

      this.app.get('/webhook', function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === _this7.config.verifyToken) {
          res.status(200).send(req.query['hub.challenge']);
        } else {
          console.error('Failed validation. Make sure the validation tokens match.');
          res.sendStatus(403);
        }
      });

      this.app.post('/webhook', function (req, res) {
        var data = req.body;
        if (data.object !== 'page') {
          return;
        }

        _this7._handleEvent('raw_webhook_body', data);

        // Iterate over each entry. There may be multiple if batched.
        data.entry.forEach(function (entry) {
          if (entry && !entry.messaging) {
            return;
          }
          // Iterate over each messaging event
          entry.messaging.forEach(function (event) {
            if (event.message && event.message.is_echo && !_this7.config.broadcastEchoes) {
              return;
            }
            if (event.message && event.message.text) {
              if (event.message.quick_reply) {
                _this7._handleQuickReplyEvent(event);
              } else {
                _this7._handleMessageEvent(event);
              }
            } else if (event.message && event.message.attachments) {
              _this7._handleAttachmentEvent(event);
            } else if (event.postback) {
              _this7._handlePostbackEvent(event);
            } else if (event.delivery) {
              _this7._handleEvent('delivery', event);
            } else if (event.read) {
              _this7._handleEvent('read', event);
            } else if (event.account_linking) {
              _this7._handleEvent('account_linking', event);
            } else if (event.optin) {
              _this7._handleEvent('optin', event);
            } else if (event.referral) {
              _this7._handleEvent('referral', event);
            } else if (event.payment) {
              _this7._handleEvent('payment', event);
            } else {
              console.log('Webhook received unknown event: ', event);
            }
          });
        });

        // Must send back a 200 within 20 seconds or the request will time out.
        res.sendStatus(200);
      });
    }
  }, {
    key: '_verifyRequestSignature',
    value: function _verifyRequestSignature(req, res, buf) {
      if (!/^\/webhook/i.test(req.path)) {
        return;
      }

      var signature = req.headers['x-hub-signature'];
      if (!signature) {
        throw new Error("Couldn't validate the request signature.");
      } else {
        var _signature$split = signature.split('='),
            _signature$split2 = _slicedToArray(_signature$split, 2),
            hash = _signature$split2[1];

        var expectedHash = crypto.createHmac('sha1', this.config.appSecret).update(buf).digest('hex');

        if (hash != expectedHash) {
          throw new Error("Couldn't validate the request signature.");
        }
      }
    }
  }, {
    key: '_reformatPersistentMenuItems',
    value: function _reformatPersistentMenuItems() {
      if (this.config.persistentMenu && this.config.persistentMenuItems) {
        return this.config.persistentMenuItems.map(function (item) {
          if (item.value && item.type === 'postback') {
            item.payload = item.value;
            delete item.value;
          } else if (item.value && item.type === 'url') {
            item.url = item.value;
            item.type = 'web_url';
            delete item.value;
          }
          return item;
        });
      }
    }
  }, {
    key: '_setupNewWebhook',
    value: function _setupNewWebhook() {
      var _this8 = this;

      var oAuthUrl = 'https://graph.facebook.com/v' + this.config.graphVersion + '/oauth/access_token' + '?client_id=' + this.config.applicationID + '&client_secret=' + this.config.appSecret + '&grant_type=client_credentials';

      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/' + this.config.applicationID + '/subscriptions?access_token=';

      if (process.env.NODE_ENV != "production") {
        console.log("Setting up new Webhook", oAuthUrl, url);
      }

      return fetch(oAuthUrl).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).then(function (json) {
        return json.access_token;
      }).then(function (token) {
        return fetch(url + token, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            object: 'page',
            callback_url: 'https://' + _this8.config.hostname + '/api/botpress-messenger/webhook',
            verify_token: _this8.config.verifyToken,
            fields: _this8.config.webhookSubscriptionFields
          })
        });
      }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        console.error("Error setting up webhook", err);
      });
    }
  }, {
    key: '_subscribePage',
    value: function _subscribePage() {
      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/me/subscribed_apps?access_token=' + this.config.accessToken;
      var subscribed_fields = ['messages', 'message_deliveries', 'messaging_referrals', 'messaging_postbacks', 'messaging_optins'];

      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({ subscribed_fields: subscribed_fields }),
        headers: { 'Content-Type': 'application/json' }
      }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        return console.error("Error in Subscribe Page: ", err);
      });
    }
  }, {
    key: '_unsubscribePage',
    value: function _unsubscribePage() {
      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/me/subscribed_apps?access_token=' + this.config.accessToken;

      return fetch(url, { method: 'DELETE' }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        return console.error("Error ubsubscribing page: ", err);
      });
    }
  }, {
    key: '_getPage',
    value: function _getPage() {
      var url = 'https://graph.facebook.com/v' + this.config.graphVersion + '/me/?access_token=' + this.config.accessToken;

      return fetch(url, { method: 'GET' }).then(this._handleFacebookResponse).then(function (res) {
        return res.json();
      }).catch(function (err) {
        return console.error("Error Getting Page: ", err);
      });
    }
  }]);

  return Messenger;
}(EventEmitter);

module.exports = Messenger;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("botpress");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("eventemitter2");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lruCache = __webpack_require__(14);

var _lruCache2 = _interopRequireDefault(_lruCache);

var _users = __webpack_require__(4);

var _users2 = _interopRequireDefault(_users);

var _outgoing = __webpack_require__(1);

var _outgoing2 = _interopRequireDefault(_outgoing);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (bp, messenger) {
  var users = (0, _users2.default)(bp, messenger);

  var logger = bp.logger;

  var messagesCache = (0, _lruCache2.default)({
    max: 10000,
    maxAge: 60 * 60 * 1000
  });

  var preprocessEvent = function preprocessEvent(payload) {
    var userId = payload.sender && payload.sender.id;
    var mid = payload.message && payload.message.mid;

    if (mid && !messagesCache.has(mid)) {
      // We already processed this message
      payload.alreadyProcessed = true;
    } else {
      // Mark it as processed
      messagesCache.set(mid, true);
    }

    return users.getOrFetchUserProfile(userId);
  };

  messenger.on('message', function (e) {
    preprocessEvent(e).then(function (profile) {
      // push the message to the incoming middleware
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'message',
        user: profile,
        text: e.message.text,
        raw: e
      });
    });
  });

  messenger.on('attachment', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'attachments',
        user: profile,
        text: e.message.attachments.length + ' attachments',
        raw: e
      });
      e.message.attachments.forEach(function (att) {
        bp.middlewares.sendIncoming({
          platform: 'facebook',
          type: att.type,
          user: profile,
          text: att.payload.url ? att.payload.url : JSON.stringify(att.payload),
          raw: att
        });
      });
    });
  });

  messenger.on('postback', function (e) {
    preprocessEvent(e).then(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(profile) {
        var mConfig, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                bp.middlewares.sendIncoming({
                  platform: 'facebook',
                  type: 'postback',
                  user: profile,
                  text: e.postback.payload,
                  raw: e
                });

                if (!(e.postback.payload === 'GET_STARTED')) {
                  _context.next = 14;
                  break;
                }

                mConfig = messenger.getConfig();

                if (!(mConfig.displayGetStarted && mConfig.autoResponseOption == 'autoResponseTextRenderer')) {
                  _context.next = 13;
                  break;
                }

                _context.prev = 4;
                options = mConfig.autoResponseText ? { text: mConfig.autoResponseText } : {};
                _context.next = 8;
                return bp.renderers.sendToUser(profile.id, mConfig.autoResponseTextRenderer, options);

              case 8:
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](4);

                logger.warn('unavailable "autoResponseTextRenderer"');

              case 13:

                if (mConfig.displayGetStarted && mConfig.autoResponseOption == 'autoResponsePostback') {
                  bp.middlewares.sendIncoming({
                    platform: 'facebook',
                    type: 'postback',
                    user: profile,
                    text: mConfig.autoResponsePostback,
                    raw: e
                  });
                }

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[4, 10]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });

  messenger.on('quick_reply', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'quick_reply',
        user: profile,
        text: e.message.quick_reply.payload,
        raw: e
      });
    });
  });

  messenger.on('delivery', function (e) {
    _lodash2.default.values(_outgoing2.default.pending).forEach(function (pending) {
      var recipient = pending.event.raw.to;
      if (e.sender.id === recipient && pending.event.raw.waitDelivery) {
        if (_lodash2.default.includes(e.delivery.mids, pending.mid)) {
          pending.resolve(e);
          delete _outgoing2.default.pending[pending.event.__id];
        }
      }
    });

    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'delivery',
        user: profile,
        text: e.delivery.watermark.toString(),
        raw: e
      });
    });
  });

  messenger.on('read', function (e) {
    _lodash2.default.values(_outgoing2.default.pending).forEach(function (pending) {
      var recipient = pending.event.raw.to;
      if (e.sender.id === recipient) {
        if (pending.event.raw.waitRead && pending.timestamp && pending.timestamp <= e.read.watermark) {
          pending.resolve(e);
          delete _outgoing2.default.pending[pending.event.__id];
        }
      }
    });

    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'read',
        user: profile,
        text: e.read.watermark.toString(),
        raw: e
      });
    });
  });

  messenger.on('account_linking', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'account_linking',
        user: profile,
        text: e.account_linking.authorization_code,
        raw: e
      });
    });
  });

  messenger.on('optin', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'optin',
        user: profile,
        text: e.optin.ref,
        raw: e
      });
    });
  });

  messenger.on('referral', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'referral',
        user: profile,
        text: e.referral.ref,
        raw: e
      });
    });
  });

  messenger.on('payment', function (e) {
    preprocessEvent(e).then(function (profile) {
      bp.middlewares.sendIncoming({
        platform: 'facebook',
        type: 'payment',
        text: 'payment',
        user: profile,
        payment: e.payment,
        raw: e
      });
    });
  });
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("lru-cache");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = __webpack_require__(16);

var _util2 = _interopRequireDefault(_util);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = __webpack_require__(17);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUICK_REPLY_PAYLOAD = /\<(.+)\>\s(.+)/i;

function processButtons(buttons, blocName) {
  return processQuickReplies(buttons, blocName).map(function (button) {
    if (button.payload && button.title && _lodash2.default.isNil(button.type)) {
      return Object.assign(button, { type: 'postback' });
    }

    return button;
  });
}

function processQuickReplies(qrs, blocName) {
  if (!_lodash2.default.isArray(qrs)) {
    throw new Error('Expected quick_replies to be an array');
  }

  return qrs.map(function (qr) {
    if (_lodash2.default.isString(qr) && QUICK_REPLY_PAYLOAD.test(qr)) {
      var _QUICK_REPLY_PAYLOAD$ = QUICK_REPLY_PAYLOAD.exec(qr),
          _QUICK_REPLY_PAYLOAD$2 = _slicedToArray(_QUICK_REPLY_PAYLOAD$, 3),
          payload = _QUICK_REPLY_PAYLOAD$2[1],
          text = _QUICK_REPLY_PAYLOAD$2[2];

      // <.HELLO> becomes <BLOCNAME.HELLO>


      if (payload.startsWith('.')) {
        payload = blocName + payload;
      }

      return {
        title: text,
        payload: payload.toUpperCase()
      };
    }

    return qr;
  });
}

function amendButtons(obj, blocName) {
  if (!_lodash2.default.isPlainObject(obj)) {
    return obj;
  }

  return _lodash2.default.mapValues(obj, function (value, key) {
    if (_lodash2.default.isPlainObject(value)) {
      return amendButtons(value, blocName);
    } else if (_lodash2.default.isArray(value)) {
      if (key === 'buttons') {
        return amendButtons(processButtons(value, blocName));
      }
      return value.map(function (v) {
        return amendButtons(v, blocName);
      });
    } else {
      return value;
    }
  });
}

function getUserId(event) {
  var userId = _lodash2.default.get(event, 'user.userId') || _lodash2.default.get(event, 'raw.userId') || _lodash2.default.get(event, 'userId') || _lodash2.default.get(event, 'raw.from') || _lodash2.default.get(event, 'user.id') || _lodash2.default.get(event, 'raw.user.id');

  if (!userId) {
    throw new Error('Could not find userId in the incoming event.');
  }

  if (userId.startsWith('facebook:')) {
    return userId.substr('facebook:'.length);
  }

  return userId;
}

function _processOutgoing(_ref) {
  var event = _ref.event,
      blocName = _ref.blocName,
      instruction = _ref.instruction;

  var ins = Object.assign({}, instruction); // Create a shallow copy of the instruction

  ////////
  // PRE-PROCESSING
  ////////

  var optionsList = ['quick_replies', 'waitRead', 'waitDelivery', 'typing', 'tag', '__platformSpecific', 'on', 'isReusable', 'attachmentId'];

  var options = _lodash2.default.pick(instruction, optionsList);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = optionsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      delete ins[prop];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (options.quick_replies) {
    options.quick_replies = processQuickReplies(options.quick_replies, blocName);
  }

  /////////
  /// Processing
  /////////

  if (!_lodash2.default.isNil(instruction.template_type)) {
    var data = amendButtons(ins, blocName);
    return _actions2.default.createTemplate(getUserId(event), data, options);
  }

  var _arr = ['image', 'audio', 'video', 'file'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var attr = _arr[_i];
    if (!_lodash2.default.isNil(instruction[attr])) {
      return _actions2.default.createAttachment(getUserId(event), attr, ins[attr], options);
    }
  }

  if (!_lodash2.default.isNil(instruction.attachment)) {
    return _actions2.default.createAttachment(getUserId(event), instruction.type || instruction.attachment, ins.url || instruction.attachment, options);
  }

  if (!_lodash2.default.isNil(instruction.text)) {
    return _actions2.default.createText(getUserId(event), instruction.text, options);
  }

  ////////////
  /// POST-PROCESSING
  ////////////

  // Nothing to post-process yet

  ////////////
  /// INVALID INSTRUCTION
  ////////////

  var strRep = _util2.default.inspect(instruction, false, 1);
  throw new Error('Unrecognized instruction on Facebook Messenger in bloc \'' + blocName + '\': ' + strRep);
}

////////////
/// TEMPLATES
////////////

function getTemplates() {
  return [{
    type: 'Text - Single message',
    template: 'block_name_sm:\n  - Text goes here..'
  }, {
    type: 'Text - Multiple messages',
    template: 'block_name_mm:\n  - Text goes here..(1)\n  - Text goes here..(2)'
  }, {
    type: 'Text - Random message',
    template: 'block_name_rm:\n  - text:\n    - Text goes here..(1)\n    - Text goes here..(2)'
  }, {
    type: 'Typing - Message with typing',
    template: 'block_name_bm:\n  - text: Text goes here..(1)\n    typing: 1000ms'
  }, {
    type: 'Text - Quick replies',
    template: 'block_name_qr:\n  - text: Text goes here..\n    quick_replies:\n    - <POSTBACK_1> Button..(1)\n    - <POSTBACK_2> Button..(2)'
  }, {
    type: 'Attachment - Image',
    template: 'block_image:\n  - on: facebook\n    image: https://botpress.io/static/img/nobg_primary_black.png'
  }, {
    type: 'Attachment - Video',
    template: 'block_video:\n  - on: facebook\n    video: https://www.youtube.com/watch?v=QIokUU4HAKU'
  }, {
    type: 'Template - Generic',
    template: 'block_generic:\n  - on: facebook\n    template_type: generic\n    elements:\n    - title: Welcome to Botpress\n      image_url: https://botpress.io/static/img/grey_bg_primary.png\n      subtitle: This is a great building framework\n      default_action:\n      - type: web_url\n        url: https://botpress.io\n        messenger_extensions: false\n        webview_height_ratio: tall\n        fallback_url: https://botpress.io\n      buttons:\n      - <BTN_RANDOM> Random cat videos\n      - type: postback\n        title: This button gives the same thing\n        payload: BTN_RANDOM\n      - type: web_url\n        url: https://youtube.com/?q=cats\n        title: Cats on Youtube'
  }, {
    type: 'Template - Carousel',
    template: 'block_carousel:\n  - on: facebook\n    template_type: generic\n    elements:\n    - title: Welcome to Botpress\n      image_url: https://botpress.io/static/img/grey_bg_primary.png\n      subtitle: This is a great building framework\n      default_action:\n      - type: web_url\n        url: https://botpress.io\n        messenger_extensions: false\n        webview_height_ratio: tall\n        fallback_url: https://botpress.io\n      buttons:\n      - <BTN_RANDOM> Random cat videos\n      - type: postback\n        title: This button gives the same thing\n        payload: BTN_RANDOM\n      - type: web_url\n        url: https://youtube.com/?q=cats\n        title: Cats on Youtube\n    - title: Bienvenido a Botpress\n      image_url: https://botpress.io/static/img/nobg_primary_black.png\n      subtitle: Este es un gran marco de construcción\n      default_action:\n      - type: web_url\n        url: https://botpress.io\n        messenger_extensions: false\n        webview_height_ratio: tall\n        fallback_url: https://botpress.io\n      buttons:\n      - <BTN_RANDOM> Videos de perros al azar\n      - type: postback\n        title: Este botón da lo mismo\n        payload: BTN_RANDOM\n      - type: web_url\n        url: https://youtube.com/?q=cats\n        title: Gatos en Youtube'
  }];
}

module.exports = function (bp) {
  var _$at = _lodash2.default.at(bp, ['renderers', 'renderers.registerConnector']),
      _$at2 = _slicedToArray(_$at, 2),
      renderers = _$at2[0],
      registerConnector = _$at2[1];

  renderers && registerConnector && registerConnector({
    platform: 'facebook',
    processOutgoing: function processOutgoing(args) {
      return _processOutgoing(Object.assign({}, args, { bp: bp }));
    },
    templates: getTemplates()
  });
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = __webpack_require__(3);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _outgoing = __webpack_require__(1);

var _outgoing2 = _interopRequireDefault(_outgoing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create = function create(obj) {
  var resolve = null;
  var reject = null;
  var promise = new _bluebird2.default(function (r, rj) {
    resolve = r;
    reject = rj;
  });

  var messageId = new Date().toISOString() + Math.random();

  var newEvent = Object.assign({
    _promise: promise,
    _resolve: resolve,
    _reject: reject,
    __id: messageId
  }, obj);

  _outgoing2.default.pending[messageId] = {
    event: newEvent,
    resolve: resolve,
    reject: reject
  };

  return newEvent;
};

var validateUserId = function validateUserId(userId) {
  if (!/[0-9]+/.test(userId)) {
    throw new Error('Invalid userId');
  }
};

var validateText = function validateText(text) {
  if (typeof text !== 'string' || text.length > 640) {
    throw new Error('Text must be a string less than 640 chars.');
  }
};

var validateQuickReply = function validateQuickReply(quick_reply) {
  if (typeof quick_reply !== 'string') {
    if (!quick_reply || typeof quick_reply.title !== 'string' && !_lodash2.default.includes(['location', 'user_email', 'user_phone_number'], quick_reply.content_type)) {
      throw new Error('Expected quick_reply to be a string or an object' + 'with a title or one of these content_types: location, user_email, user_phone_number');
    }
  }
};

var validateQuickReplies = function validateQuickReplies(quick_replies) {
  if (!_lodash2.default.isArray(quick_replies)) {
    throw new Error('quick_replies must be an array');
  }

  _lodash2.default.forEach(quick_replies, validateQuickReply);
};

var validateTyping = function validateTyping(typing) {
  if (!_lodash2.default.isBoolean(typing) && !_lodash2.default.isNumber(typing)) {
    throw new Error('Expected typing to be a boolean of a number');
  }
};

var validateAttachmentType = function validateAttachmentType(type) {
  if (typeof type !== 'string') {
    throw new Error('Expected attachment type to be a text');
  }

  if (!_lodash2.default.includes(['image', 'video', 'audio', 'file'], type.toLowerCase())) {
    throw new Error('Invalid attachment type');
  }
};

var validateUrl = function validateUrl(url) {
  if (typeof url !== 'string') {
    throw new Error('Expected URL to be a string');
  }
};

var validateTemplatePayload = function validateTemplatePayload(payload) {
  if (!_lodash2.default.isPlainObject(payload)) {
    throw new Error('Template payload must be a plain object');
  }

  if (typeof payload.template_type !== 'string') {
    throw new Error('"template_type" must be set');
  }
};

var validatePersistentMenu = function validatePersistentMenu(elements) {
  if (!_lodash2.default.isArray(elements)) {
    throw new Error('Expected elements to be an array');
  }

  _lodash2.default.forEach(elements, function (element) {
    if (!_lodash2.default.isPlainObject(element)) {
      throw new Error('Expected element to be a plain object');
    }
  });
};

var createText = function createText(userId, text, options) {
  validateUserId(userId);
  validateText(text);

  if (options && options.quick_replies) {
    validateQuickReplies(options.quick_replies);
  }

  if (options && options.typing) {
    validateTyping(options.typing);
  }

  return create({
    platform: 'facebook',
    type: 'text',
    text: text,
    raw: {
      to: userId,
      message: text,
      typing: options && options.typing,
      quick_replies: options && options.quick_replies,
      waitRead: options && options.waitRead,
      waitDelivery: options && options.waitDelivery
    }
  });
};

var createAttachment = function createAttachment(userId, type, url, options) {
  validateUserId(userId);
  validateAttachmentType(type);

  if (_lodash2.default.isNull(url) && !(options && options.attachmentId)) {
    throw new Error('If URL is null, you must pass an attachment_id on options object');
  } else if (options && options.attachmentId) {
    validateText(options.attachmentId);
  } else {
    validateUrl(url);
  }

  if (options && options.quick_replies) {
    validateQuickReplies(options.quick_replies);
  }

  if (options && options.typing) {
    validateTyping(options.typing);
  }

  return create({
    platform: 'facebook',
    type: 'attachment',
    text: 'Attachment (' + type + ') : ' + url,
    raw: {
      to: userId,
      type: type,
      url: url,
      isReusable: options && options.isReusable,
      attachmentId: options && options.attachmentId,
      typing: options && options.typing,
      quick_replies: options && options.quick_replies,
      waitRead: options && options.waitRead,
      waitDelivery: options && options.waitDelivery
    }
  });
};

var createTemplate = function createTemplate(userId, payload, options) {
  validateUserId(userId);
  validateTemplatePayload(payload);

  if (options && options.typing) {
    validateTyping(options.typing);
  }

  return create({
    platform: 'facebook',
    type: 'template',
    text: 'Template (' + payload.template_type + ')',
    raw: {
      to: userId,
      payload: payload,
      typing: options && options.typing,
      quick_replies: options && options.quick_replies,
      waitRead: options && options.waitRead,
      waitDelivery: options && options.waitDelivery
    }
  });
};

var createTyping = function createTyping(userId, typing) {
  validateUserId(userId);
  validateTyping(typing);

  return create({
    platform: 'facebook',
    type: 'typing',
    text: 'Typing: ' + typing,
    raw: {
      to: userId,
      typing: typing
    }
  });
};

var createSeen = function createSeen(userId) {
  validateUserId(userId);

  return create({
    platform: 'facebook',
    type: 'seen',
    text: 'Mark as seen',
    raw: {
      to: userId
    }
  });
};

var createPersistentMenu = function createPersistentMenu(elements) {
  if (!elements) {
    return create({
      platform: 'facebook',
      type: 'persistent_menu',
      text: 'Delete the persistent menu',
      raw: {
        delete: true
      }
    });
  }

  validatePersistentMenu(elements);
  return create({
    platform: 'facebook',
    type: 'persistent_menu',
    text: 'Set persistent menu: ' + elements.length + ' items',
    raw: {
      delete: false,
      elements: elements
    }
  });
};

var createGreetingText = function createGreetingText(text) {
  if (text && text.length > 160) {
    throw new Error('Greeting text must be less than 160 chars');
  }

  return create({
    platform: 'facebook',
    type: 'greeting_text',
    text: 'Set greeting text: ' + text,
    raw: {
      text: text
    }
  });
};

var createGetStarted = function createGetStarted(postback) {
  return create({
    platform: 'facebook',
    type: 'get_started',
    text: 'Setting get started button: ' + !!postback,
    raw: {
      enabled: !!postback,
      postback: postback
    }
  });
};

var createWhitelistedDomains = function createWhitelistedDomains(domains) {
  if (domains && !_lodash2.default.every(domains, _lodash2.default.isString)) {
    throw new Error('Expected domains to be a list of string');
  }

  return create({
    platform: 'facebook',
    type: 'whitelisted_domains',
    text: 'Setting whitelisted domains',
    raw: {
      domains: domains
    }
  });
};

module.exports = {
  createText: createText,
  createAttachment: createAttachment,
  createTemplate: createTemplate,
  createTyping: createTyping,
  createSeen: createSeen,
  createGetStarted: createGetStarted,
  createPersistentMenu: createPersistentMenu,
  createGreetingText: createGreetingText,
  createWhitelistedDomains: createWhitelistedDomains
};

/***/ })
/******/ ]);
//# sourceMappingURL=node.bundle.js.map