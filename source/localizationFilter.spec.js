(function(window, document, undefined) {
  'use strict';

  describe('Localization filter', function() {
    var LocalizationStorage;
    var $filter;

    var variables = {
      variablesMultipleUses: ['Sauerkraut', 'Weißbier']
    };

    // default english localizations
    var localizations_en = {
      variablesMultipleUses: '"{1}" equals "{1}" and "{0}" equals "{0}".',
    };
    // expected english strings
    var expected_en = {
      variablesMultipleUses: '"' + variables.variablesMultipleUses[1] + '" equals "' + variables.variablesMultipleUses[1] + '" and "' + variables.variablesMultipleUses[0] + '" equals "' + variables.variablesMultipleUses[0] + '".',
    };



    beforeEach(angular.mock.module('localization.filter'));

    beforeEach(angular.mock.inject(function($injector) {
      LocalizationStorage = $injector.get('LocalizationStorage');
      $filter = $injector.get('$filter');

      LocalizationStorage.add('en', localizations_en);
    }));




    it('translates a string with multiple uses of the same variable', function() {
      expect( $filter('localize')('variablesMultipleUses', variables.variablesMultipleUses[0], variables.variablesMultipleUses[1]) ).toBe(expected_en.variablesMultipleUses);
    });

  });

})(window, document);
