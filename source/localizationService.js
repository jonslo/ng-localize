(function(window, document, undefined) {
  'use strict';

  var app = angular.module('localization.service', ['localization.storage']);

  app.service('localize', [
    '$log', 'LocalizationStorage',
    function LocalizeService($log, LocalizationStorage) {
      var localizations = LocalizationStorage.get();

      return function localize(id) {
        var parameters = Array.prototype.slice.call(arguments, 1);

        var template = localizations.active[id];

        if(!template) {
          var message = 'No translation has been found for the id "' + id + '"';

          // throw an exception in strict mode, otherwise
          // only warn and return the requested id itself
          if(localizations.strictMode) {
            var error = new Error();
            error.name = 'TranslationNotFoundException';
            error.message = message;
            throw error;

          } else {
            $log.warn(message);

            template = id;
          }
        }

        var output = template.replace(/\{(\d+)}/g, function(match, submatch_1) {
          return parameters[submatch_1];
        });

        return output;
      };
    }
  ]);

})(window, document);
