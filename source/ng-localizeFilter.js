'use strict';

import localizeService from './ng-localizeService.js';

export default angular.module('localize.filter', [localizeService.name])
  .filter('localize', LocalizeFilter);

function LocalizeFilter(localize) {
  return (...args) => {
    return localize.apply(null, args);
  };
}
