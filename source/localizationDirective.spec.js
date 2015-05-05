(function(window, document, undefined) {
  'use strict';

  describe('Localization directive', function() {
    var LocalizationStorage;
    var localize;
    var $scope;
    var element;

    // default english localizations
    var LOCALIZATIONS_EN = {
      key : '"{1}" equals "{1}" and "{0}" equals "{0}".',
    };
    var LOCALIZATIONS_DE = {
      key : '"{1}" gleicht "{1}" und "{0}" gleicht "{0}".',
    };

    var createTestEnv = function(keyString, varsString) {
      angular.mock.inject(function($injector) {
        $scope = $injector.get('$rootScope').$new();

        element = angular.element(
          '<localize ng-app key="' + keyString + '" vars="' + varsString +
              '"></localize>'
        );

        var $compile = $injector.get('$compile');
        var compile = $compile(element);
        var compiled = compile($scope);
        $scope.$digest();

        element = compiled[0];
      });
    };

    beforeEach(angular.mock.module('localization.directive'));
    beforeEach(angular.mock.inject(function($injector) {
      LocalizationStorage = $injector.get('LocalizationStorage');
      localize = $injector.get('localize');

      LocalizationStorage.add('en', LOCALIZATIONS_EN);
      LocalizationStorage.add('de', LOCALIZATIONS_DE);
    }));

    it('localizes a simple string', function() {
      createTestEnv('key');
      expect(element.innerText).toEqual(localize('key'));
    });

    it('updates a simple string when the current language changes', function() {
      createTestEnv('key');
      expect(element.innerText).toEqual(localize('key'));

      LocalizationStorage.set('de');
      expect(element.innerText).toEqual(localize('key'));
    });

    it('localizes a string w/ a single string variable', function() {
      createTestEnv('key', "'test'");
      expect(element.innerText).toEqual(localize('key', 'test'));
    });

    it('updates a string w/ a single string variable when the current ' +
        'language changes', function() {
      createTestEnv('key', "'test'");
      expect(element.innerText).toEqual(localize('key', 'test'));

      LocalizationStorage.set('de');
      expect(element.innerText).toEqual(localize('key', 'test'));
    });

    it('localizes a string w/ an array of strings', function() {
      createTestEnv('key', "['string 1', 'string 2']");
      expect(element.innerText).toEqual(
          localize('key', 'string 1', 'string 2'));
    });

    it('updates a string w/ an array of strings when the current language ' +
        'changes', function() {
      createTestEnv('key', "['string 1', 'string 2']");
      expect(element.innerText).toEqual(
          localize('key', 'string 1', 'string 2'));

      LocalizationStorage.set('de');
      expect(element.innerText).toEqual(
          localize('key', 'string 1', 'string 2'));
    });

    it('localizes a string w/ a single $scope variable', function() {
      $scope.scopeVar = 'test';
      createTestEnv('key', 'scopeVar');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
    });

    it('updates a string w/ a single $scope variable when the current ' +
        'language changes', function() {
      $scope.scopeVar = 'test';
      createTestEnv('key', 'scopeVar');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar));

      LocalizationStorage.set('de');
      expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
    });

    it('updates a string w/ a single $scope variable when the $scope ' +
        'variable changes', function() {
      $scope.scopeVar = 'test';
      createTestEnv('key', 'scopeVar');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar));

      $scope.scopeVar += '?!';
      $scope.$digest();
      expect(element.innerText).toEqual(localize('key', $scope.scopeVar));
    });

    it('localizes a string w/ an array of $scope variables', function() {
      $scope.scopeVar1 = 'string 1';
      $scope.scopeVar2 = 'string 2';
      createTestEnv('key', '[scopeVar1, scopeVar2]');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));
    });

    it('updates a string w/ an array of $scope variables when the current ' +
        'language changes', function() {
      $scope.scopeVar1 = 'string 1';
      $scope.scopeVar2 = 'string 2';
      createTestEnv('key', '[scopeVar1, scopeVar2]');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));

      LocalizationStorage.set('de');
      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));
    });

    it('updates a string w/ an array of $scope variables when the $scope ' +
        'variables change', function() {
      $scope.scopeVar1 = 'string 1';
      $scope.scopeVar2 = 'string 2';
      createTestEnv('key', '[scopeVar1, scopeVar2]');

      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));

      $scope.scopeVar1 += '?!';
      $scope.$digest();
      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));

      $scope.scopeVar2 += '?!';
      $scope.$digest();
      expect(element.innerText).toEqual(localize('key', $scope.scopeVar1,
          $scope.scopeVar2));
    });

  });

})(window, document);
