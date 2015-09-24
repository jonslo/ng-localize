'use strict';

describe('Localization directive', () => {
  let LocalizationStorage;
  let localize;
  let $scope;
  let element;

  // default english localizations
  let LOCALIZATIONS_EN = {
    key: '"{1}" equals "{1}" and <i>"{0}"</i> equals <i>"{0}"</i>.',
  };
  let LOCALIZATIONS_DE = {
    key: '"{1}" gleicht "{1}" und <i>"{0}"</i> gleicht <i>"{0}"</i>.',
  };

  function createTestEnv(keyString, varsString, htmlMode) {
    angular.mock.inject(($injector) => {
      $scope = $injector.get('$rootScope').$new();

      element = angular.element(
        `<localize
           ng-app key="${keyString}"
           vars="${varsString}"
           ${(!!htmlMode ? 'localize-html' : '') /* output template as HTML */}
         ></localize>`
      );

      let $compile = $injector.get('$compile');
      let compile = $compile(element);
      let compiled = compile($scope);
      $scope.$digest();

      element = compiled[0];
    });
  };

  beforeEach(angular.mock.module('ngSanitize'));
  beforeEach(angular.mock.module('localization.directive'));
  beforeEach(angular.mock.inject(($injector) => {
    LocalizationStorage = $injector.get('LocalizationStorage');
    localize = $injector.get('localize');

    LocalizationStorage.add('en', LOCALIZATIONS_EN);
    LocalizationStorage.add('de', LOCALIZATIONS_DE);
  }));

  it('localizes a simple string', () => {
    createTestEnv('key');
    expect(element.innerText).toEqual(localize('key'));
  });

  it('updates a simple string when the current language changes', () => {
    createTestEnv('key');
    expect(element.innerText).toEqual(localize('key'));

    LocalizationStorage.set('de');
    expect(element.innerText).toEqual(localize('key'));
  });

  it('localizes a string w/ a single string variable', () => {
    createTestEnv('key', `'test'`);
    expect(element.innerText).toEqual(localize('key', 'test'));
  });

  it('updates a string w/ a single string variable when the current language changes', () => {
    createTestEnv('key', `'test'`);
    expect(element.innerText).toEqual(localize('key', 'test'));

    LocalizationStorage.set('de');
    expect(element.innerText).toEqual(localize('key', 'test'));
  });

  it('localizes a string w/ an array of strings', () => {
    createTestEnv('key', `['string 1', 'string 2']`);
    expect(element.innerText).toEqual(localize('key', 'string 1', 'string 2'));
  });

  it('updates a string w/ an array of strings when the current language changes', () => {
    createTestEnv('key', `['string 1', 'string 2']`);
    expect(element.innerText).toEqual(localize('key', 'string 1', 'string 2'));

    LocalizationStorage.set('de');
    expect(element.innerText).toEqual(localize('key', 'string 1', 'string 2'));
  });

  it('localizes a string w/ a single $scope variable', () => {
    $scope.scopeVar = 'test';
    createTestEnv('key', 'scopeVar');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
  });

  it('updates a string w/ a single $scope variable when the current language changes', () => {
    $scope.scopeVar = 'test';
    createTestEnv('key', 'scopeVar');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar));

    LocalizationStorage.set('de');
    expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
  });

  it('updates a string w/ a single $scope variable when the $scope variable changes', () => {
    $scope.scopeVar = 'test';
    createTestEnv('key', 'scopeVar');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar));

    $scope.scopeVar += '?!';
    $scope.$digest();
    expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
  });

  it('localizes a string w/ an array of $scope variables', () => {
    $scope.scopeVar1 = 'string 1';
    $scope.scopeVar2 = 'string 2';
    createTestEnv('key', '[scopeVar1, scopeVar2]');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));
  });

  it('updates a string w/ an array of $scope variables when the current language changes', () => {
    $scope.scopeVar1 = 'string 1';
    $scope.scopeVar2 = 'string 2';
    createTestEnv('key', '[scopeVar1, scopeVar2]');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));

    LocalizationStorage.set('de');
    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));
  });

  it('updates a string w/ an array of $scope variables when the $scope variables change', () => {
    $scope.scopeVar1 = 'string 1';
    $scope.scopeVar2 = 'string 2';
    createTestEnv('key', '[scopeVar1, scopeVar2]');

    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));

    $scope.scopeVar1 += '?!';
    $scope.$digest();
    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));

    $scope.scopeVar2 += '?!';
    $scope.$digest();
    expect(element.innerText).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));
  });

  it('inserts the template as HTML instead of text if the `localize-html` attribute is set', () => {
    $scope.scopeVar1 = 'string 1';
    $scope.scopeVar2 = 'string 2';
    createTestEnv('key', '[scopeVar1, scopeVar2]', !!'htmlMode');

    expect(element.innerHTML).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));

    $scope.scopeVar1 += '?!';
    $scope.$digest();
    expect(element.innerHTML).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));

    $scope.scopeVar2 += '?!';
    $scope.$digest();
    expect(element.innerHTML).toEqual(localize('key', $scope.scopeVar1, $scope.scopeVar2));
  });

});
