(function (window, document, undefined) {
  'use strict';

  angular.module('localize.service', ['localize.storage']).service('localize', LocalizeService);

  function LocalizeService($log, LocalizeStorage) {
    var localizations = LocalizeStorage.get();

    return function (id) {
      for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        parameters[_key - 1] = arguments[_key];
      }

      var template = localizations.active[id];

      if (!template) {
        var message = 'No translation has been found for the id "' + id + '"';

        // throw an exception in strict mode, otherwise
        // only warn and return the requested id itself
        if (localizations.strictMode) {
          var error = new Error();
          error.name = 'TranslationNotFoundException';
          error.message = message;
          throw error;
        } else {
          $log.warn(message);

          template = id;
        }
      }

      var output = template.replace(/\{(\d+)}/g, function (match, submatchFirst) {
        return parameters[submatchFirst];
      });

      return output;
    };
  }
})(window, document);