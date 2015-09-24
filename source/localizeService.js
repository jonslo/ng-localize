((window, document, undefined) => {
  'use strict';

  angular.module('localize.service', ['localize.storage'])
    .service('localize', LocalizeService);

  function LocalizeService($log, LocalizeStorage) {
    let localizations = LocalizeStorage.get();

    return (id, ...parameters) => {
      let template = localizations.active[id];

      if (!template) {
        let message = `No translation has been found for the id "${id}"`;

        // throw an exception in strict mode, otherwise
        // only warn and return the requested id itself
        if (localizations.strictMode) {
          let error = new Error();
          error.name = 'TranslationNotFoundException';
          error.message = message;
          throw error;

        } else {
          $log.warn(message);

          template = id;
        }
      }

      let output = template.replace(/\{(\d+)}/g, (match, submatchFirst) => {
        return parameters[submatchFirst];
      });

      return output;
    };
  }

})(window, document);
