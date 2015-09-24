((window, document, undefined) => {
  'use strict';

  angular.module('localization.filter', ['localization.service'])
    .filter('localize', LocalizeFilter);

  function LocalizeFilter(localize) {
    return (...args) => {
      return localize.apply(null, args);
    };
  }

})(window, document);
