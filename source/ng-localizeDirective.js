'use strict';

import localizeService from './ng-localizeService.js';

export default angular.module('localize.directive', [localizeService.name])
  .directive('localize', LocalizeDirective);

function LocalizeDirective($compile, $filter, $sce, $log, localize) {
  return {
    restrict: 'AE',
    link: ($scope, elem, attrs) => {
      let variables = $scope.$eval(attrs.vars);
      if (!angular.isArray(variables)) {
        variables = [variables];
      }

      // function to render the translated template
      function renderTemplate() {
        let templateArgs = [attrs.key].concat(variables);
        let template = localize.apply(null, templateArgs);

        if ('localizeHtml' in attrs) {
          elem = elem.html($sce.getTrustedHtml(template));
        } else {
          elem = elem.text(template);
        }
      };

      // watch for updated scope variables
      let watchCollectionHandle = $scope.$watchCollection(attrs.vars, (newValues, oldValues, scope) => {
        if (angular.equals(newValues, oldValues)) { return; }

        variables = newValues;
        renderTemplate();
      });

      // watch for locale change
      let onLocaleChangeHandle = $scope.$on('LocaleChange', renderTemplate);

      // cleanup time!
      elem.on('$destroy', () => {
        watchCollectionHandle();
        watchCollectionHandle = null;

        onLocaleChangeHandle();
        onLocaleChangeHandle = null;
      });

      // do the initial render
      renderTemplate();
    },
  };
}
