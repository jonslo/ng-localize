((window, document, undefined) => {
  'use strict';

  angular.module('localize.filter', ['localize.service'])
    .filter('localize', LocalizeFilter);

  function LocalizeFilter(localize) {
    return (...args) => {
      return localize.apply(null, args);
    };
  }

})(window, document);
