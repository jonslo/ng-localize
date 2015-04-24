(function(window, document, undefined) {
  'use strict';

  describe('Localization service', function() {
    var LocalizationStorage;
    var $log;
    var localize;

    var variables = {
      variable: 'Batman',
      variables: ['Spongebob', 'Squarepants'],
      variablesMixed: ['Surströmming', 'Kanelbullar'],
      variablesMultipleUses: ['Sauerkraut', 'Weißbier']
    };

    // default english localizations
    var localizations_en = {
      simple: 'This is a simple string.',
      variable: '"{0}" is an inserted variable.',
      variables: '"{0}" is an inserted variable, as well as "{1}".',
      variablesMixed: '"{1}" and "{0}" are inserted variables in reverse order.',
      variablesMultipleUses: '"{1}" equals "{1}" and "{0}" equals "{0}".',
    };
    // expected english strings
    var expected_en = {
      simple: localizations_en.simple,
      variable: '"' + variables.variable + '" is an inserted variable.',
      variables: '"' + variables.variables[0] + '" is an inserted variable, as well as "' + variables.variables[1] + '".',
      variablesMixed: '"' + variables.variablesMixed[1] + '" and "' + variables.variablesMixed[0] + '" are inserted variables in reverse order.',
      variablesMultipleUses: '"' + variables.variablesMultipleUses[1] + '" equals "' + variables.variablesMultipleUses[1] + '" and "' + variables.variablesMultipleUses[0] + '" equals "' + variables.variablesMultipleUses[0] + '".',
    };

    // fake german localizations and their expected strings
    var localizations_de = {};
    var expected_de = {};
    for(var key in localizations_en) {
      if(localizations_en.hasOwnProperty(key)) {
        localizations_de[key] = localizations_en[key] + ' Jawohl!';
        expected_de[key] = expected_en[key] + ' Jawohl!';
      }
    }



    beforeEach(angular.mock.module('localization.service'));

    beforeEach(angular.mock.inject(function($injector) {
      LocalizationStorage = $injector.get('LocalizationStorage');
      $log = $injector.get('$log');
      localize = $injector.get('localize');

      LocalizationStorage.add('en', localizations_en);
      LocalizationStorage.add('de', localizations_de);
    }));




    it('translates a simple string', function() {
      expect( localize('simple') ).toBe(expected_en.simple);
    });


    it('translates a string with one variable', function() {
      expect( localize('variable', variables.variable) ).toBe(expected_en.variable);
    });


    it('translates a string with multiple variables', function() {
      expect( localize('variables', variables.variables[0], variables.variables[1]) ).toBe(expected_en.variables);
    });


    it('translates a string with multiple variables in random order', function() {
      expect( localize('variablesMixed', variables.variablesMixed[0], variables.variablesMixed[1]) ).toBe(expected_en.variablesMixed);
    });


    it('translates a string with multiple uses of the same variable', function() {
      expect( localize('variablesMultipleUses', variables.variablesMultipleUses[0], variables.variablesMultipleUses[1]) ).toBe(expected_en.variablesMultipleUses);
    });



    it('translates to languages other than the default one', function() {
      LocalizationStorage.get('de');
      expect( localize('simple') ).toBe(expected_de.simple);
      expect( localize('variable', variables.variable) ).toBe(expected_de.variable);
      expect( localize('variables', variables.variables[0], variables.variables[1]) ).toBe(expected_de.variables);
      expect( localize('variablesMixed', variables.variablesMixed[0], variables.variablesMixed[1]) ).toBe(expected_de.variablesMixed);
      expect( localize('variablesMultipleUses', variables.variablesMultipleUses[0], variables.variablesMultipleUses[1]) ).toBe(expected_de.variablesMultipleUses);
    });



    it('displays the requested string for nonexistent localization and logs a warning in the console', function() {
      expect( localize('nonexistent') ).toBe('nonexistent');
      expect( $log.warn.logs.length ).toBe(1);
      expect( $log.warn.logs[0] ).toEqual(['No translation has been found for the id "nonexistent"']);

      $log.reset();
    });



    it('throws an TranslationNotFoundException for nonexistent localizations in strict mode', function() {
      var exceptionName;
      LocalizationStorage.strict(true);

      try {
        localize('nonexistent');
      } catch(e) {
        exceptionName = e.name;
      }

      expect( exceptionName ).toBe('TranslationNotFoundException');
    });

  });

})(window, document);
