'use strict';

describe('Localization service', () => {
  let LocalizationStorage;
  let $log;
  let localize;

  /* jscs:disable maximumLineLength */
  let VARIABLES = {
    variable: 'Batman',
    variables: ['Spongebob', 'Squarepants'],
    variablesMixed: ['Surströmming', 'Kanelbullar'],
    variablesMultipleUses: ['Sauerkraut', 'Weißbier'],
  };

  // default english localizations
  let LOCALIZATIONS_EN = {
    simple: 'This is a simple string.',
    variable: '"{0}" is an inserted variable.',
    variables: '"{0}" is an inserted variable, as well as "{1}".',
    variablesMixed: '"{1}" and "{0}" are inserted variables in reverse order.',
    variablesMultipleUses: '"{1}" equals "{1}" and "{0}" equals "{0}".',
  };

  // expected english strings
  let EXPECTED_EN = {
    simple: LOCALIZATIONS_EN.simple,
    variable: `"${VARIABLES.variable}" is an inserted variable.`,
    variables: `"${VARIABLES.variables[0]}" is an inserted variable, as well as "${VARIABLES.variables[1]}".`,
    variablesMixed: `"${VARIABLES.variablesMixed[1]}" and "${VARIABLES.variablesMixed[0]}" are inserted variables in reverse order.`,
    variablesMultipleUses: `"${VARIABLES.variablesMultipleUses[1]}" equals "${VARIABLES.variablesMultipleUses[1]}" and "${VARIABLES.variablesMultipleUses[0]}" equals "${VARIABLES.variablesMultipleUses[0]}".`,
  };
  /* jscs:enable */

  // fake german localizations and their expected strings
  let LOCALIZATIONS_DE = {};
  let EXPECTED_DE = {};
  for (let key in LOCALIZATIONS_EN) {
    if (LOCALIZATIONS_EN.hasOwnProperty(key)) {
      LOCALIZATIONS_DE[key] = LOCALIZATIONS_EN[key] + ' Jawohl!';
      EXPECTED_DE[key] = EXPECTED_EN[key] + ' Jawohl!';
    }
  }

  beforeEach(angular.mock.module('localization.service'));

  beforeEach(angular.mock.inject(($injector) => {
    LocalizationStorage = $injector.get('LocalizationStorage');
    $log = $injector.get('$log');
    localize = $injector.get('localize');

    LocalizationStorage.add('en', LOCALIZATIONS_EN);
    LocalizationStorage.add('de', LOCALIZATIONS_DE);
  }));

  it('translates a simple string', () => {
    expect(localize('simple')).toBe(EXPECTED_EN.simple);
  });

  it('translates a string with one variable', () => {
    expect(localize('variable', VARIABLES.variable)).toBe(EXPECTED_EN.variable);
  });

  it('translates a string with multiple variables', () => {
    expect(localize('variables', VARIABLES.variables[0], VARIABLES.variables[1])).toBe(EXPECTED_EN.variables);
  });

  it('translates a string with multiple variables in random order', () => {
    expect(localize('variablesMixed', VARIABLES.variablesMixed[0], VARIABLES.variablesMixed[1])).toBe(EXPECTED_EN.variablesMixed);
  });

  it('translates a string with multiple uses of the same variable', () => {
    expect(localize('variablesMultipleUses', VARIABLES.variablesMultipleUses[0], VARIABLES.variablesMultipleUses[1])).toBe(EXPECTED_EN.variablesMultipleUses);
  });

  it('translates to languages other than the default one', () => {
    LocalizationStorage.get('de');
    expect(localize('simple')).toBe(EXPECTED_DE.simple);
    expect(localize('variable', VARIABLES.variable)).toBe(EXPECTED_DE.variable);
    expect(localize('variables', VARIABLES.variables[0], VARIABLES.variables[1])).toBe(EXPECTED_DE.variables);
    expect(localize('variablesMixed', VARIABLES.variablesMixed[0], VARIABLES.variablesMixed[1])).toBe(EXPECTED_DE.variablesMixed);
    expect(localize('variablesMultipleUses', VARIABLES.variablesMultipleUses[0], VARIABLES.variablesMultipleUses[1])).toBe(EXPECTED_DE.variablesMultipleUses);
  });

  it('displays the requested string for nonexistent localization and logs a warning in the console', () => {
    expect(localize('nonexistent')).toBe('nonexistent');
    expect($log.warn.logs.length).toBe(1);
    expect($log.warn.logs[0]).toEqual(['No translation has been found for the id "nonexistent"',]);

    $log.reset();
  });

  it('throws an TranslationNotFoundException for nonexistent localizations in strict mode', () => {
    let exceptionName;
    LocalizationStorage.strict(true);

    try {
      localize('nonexistent');
    } catch (e) {
      exceptionName = e.name;
    }

    expect(exceptionName).toBe('TranslationNotFoundException');
  });

});
