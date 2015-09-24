(function (window, document, undefined) {
  'use strict';

  angular.module('localize.filter', ['localize.service']).filter('localize', LocalizeFilter);

  function LocalizeFilter(localize) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return localize.apply(null, args);
    };
  }
})(window, document);