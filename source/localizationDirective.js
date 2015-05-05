(function(window, document, undefined) {
  'use strict';

  var app = angular.module('localization.directive', ['localization.service']);

  app.directive('localize', function LocalizeDirective($compile, $filter,
      localize) {
    return {
      restrict : 'AE',
      link     : function link($scope, elem, attrs) {
        var variables = $scope.$eval(attrs.vars);
        if (!angular.isArray(variables)) {
          variables = [variables];
        }

        // function to render the translated template
        var renderTemplate = function renderTemplate() {
          var templateArgs = [attrs.key].concat(variables);
          var template = localize.apply(null, templateArgs);
          elem = elem.text(template);
        };

        // watch for updated scope variables
        var watchCollectionHandle = $scope.$watchCollection(attrs.vars,
            function(newValues, oldValues, scope) {
          if (angular.equals(newValues, oldValues)) { return; }

          variables = newValues;
          renderTemplate();
        });

        // watch for locale change
        var onLocaleChangeHandle = $scope.$on('LocaleChange', renderTemplate);

        // cleanup time!
        elem.on('$destroy', function() {
          watchCollectionHandle();
          watchCollectionHandle = null;

          onLocaleChangeHandle();
          onLocaleChangeHandle = null;
        });

        // do the initial render
        renderTemplate();
      }
    };
  });

})(window, document);
