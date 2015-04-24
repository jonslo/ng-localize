(function(window, document, undefined) {
  'use strict';

  var app = angular.module('localization.filter', ['localization.service']);

  app.filter('localize', [
    'localize',
    function LocalizeFilter(localize) {
      return function localizeFilter() {
        return localize.apply(null, arguments)
      };
    }
  ]);

})(window, document);
