define(['appMember'], function () {
    'use strict';

    angular.module('appMember').factory('humpsFactory', humpsFactory, _);

    function humpsFactory() {
        return {
            camelize: camelize,
            decamelize: decamelize,
            pascalize: pascalize,
            depascalize: decamelize,
            camelizeKeys: function (object, options) {
                return _processKeys(_processor(camelize, options), _prepObject(object));
            },
            decamelizeKeys: function (object, options) {
                return _processKeys(_processor(decamelize, options), object, options);
            },
            pascalizeKeys: function (object, options) {
                return _processKeys(_processor(pascalize, options), object);
            },
            depascalizeKeys: function () {
                return this.decamelizeKeys.apply(this, arguments);
            },
        };

        function _processKeys(convert, obj, options) {
            if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
                return obj;
            }

            var output,
                i = 0,
                l = 0;

            if (_isArray(obj)) {
                output = [];
                for (l = obj.length; i < l; i++) {
                    output.push(_processKeys(convert, obj[i], options));
                }
            } else {
                output = {};
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        output[convert(key, options)] = _processKeys(convert, obj[key], options);
                    }
                }
            }
            return output;
        }

        function separateWords(string, options) {
            options = options || {};
            var separator = options.separator || '_';
            var split = options.split || /(?=[A-Z])/;

            return string.split(split).join(separator);
        }

        function _isFunction(obj) {
            return typeof obj === 'function';
        }
        function _isObject(obj) {
            return obj === Object(obj);
        }
        function _isArray(obj) {
            return toString.call(obj) == '[object Array]';
        }
        function _isDate(obj) {
            return toString.call(obj) == '[object Date]';
        }
        function _isRegExp(obj) {
            return toString.call(obj) == '[object RegExp]';
        }
        function _isBoolean(obj) {
            return toString.call(obj) == '[object Boolean]';
        }

        function _isNumerical(obj) {
            obj = obj - 0;
            return obj === obj;
        }

        function _processor(convert, options) {
            var callback = options && 'process' in options ? options.process : options;

            if (typeof callback !== 'function') {
                return convert;
            }

            return function (string, options) {
                return callback(string, convert, options);
            };
        }

        function _prepObject(object) {
            return _.omit(object, ['config', 'headers']);
        }

        function camelize(string) {
            if (_isNumerical(string)) {
                return string;
            }
            string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
            // Ensure 1st char is always lowercase
            return string.substr(0, 1).toLowerCase() + string.substr(1);
        }

        function pascalize(string) {
            var camelized = camelize(string);
            // Ensure 1st char is always uppercase
            return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
        }

        function decamelize(string, options) {
            return separateWords(string, options).toLowerCase();
        }
    }
});
