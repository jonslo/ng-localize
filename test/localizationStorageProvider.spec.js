'use strict';

let LOCALIZATION_EN = { yes: 'Yes' };
let LOCALIZATION_DE = { yes: 'Ja' };
let LOCALIZATION_SV = { yes: 'Ja' };
let LOCALIZATION_FR = { yes: 'Oui' };

describe('LocalizeStorage service', () => {
  let LocalizeStorage;
  let $rootScope;

  beforeEach(angular.mock.module('localize.storage'));

  beforeEach(angular.mock.inject(($injector) => {
    $rootScope = $injector.get('$rootScope').$new();
    LocalizeStorage = $injector.get('LocalizeStorage');
  }));

  it('initially has no localizations, but the referenced variables are present', () => {
    let localizations = LocalizeStorage.get();
    expect(LocalizeStorage.list().length).toBe(0);
    expect(localizations.active).toBe(null);
    expect(localizations.activeId).toBe(null);
  });

  it('can add mulitple localizations and the first one is enabled by default', () => {
    LocalizeStorage.add('en', LOCALIZATION_EN);
    LocalizeStorage.add('de', LOCALIZATION_DE);

    let localizations = LocalizeStorage.get();
    expect(LocalizeStorage.list().length).toBe(2);

    // default locale is the one first added
    expect(localizations.active).toEqual(LOCALIZATION_EN);
    expect(localizations.activeId).toBe('en');
  });

  it('can set the active localizaton', () => {
    LocalizeStorage.add('sv', LOCALIZATION_SV);
    LocalizeStorage.add('fr', LOCALIZATION_FR);

    let localizations = LocalizeStorage.get();

    // using set()
    expect(LocalizeStorage.set('sv')).toBe(true);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // using set() with extended locale format
    expect(LocalizeStorage.set('sv-SE')).toBe(true);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // same test as before but with a different locale format
    expect(LocalizeStorage.set('sv_SE')).toBe(true);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // trying set() with a nonexistent localization
    expect(LocalizeStorage.set('nonexistent')).toBe(false);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // using get() with a specific locale but without assigning it's response again
    LocalizeStorage.get('fr');
    expect(localizations.activeId).toBe('fr');
    expect(localizations.active).toEqual(LOCALIZATION_FR);

    // trying get() with a nonexistent localization
    LocalizeStorage.get('nonexistent');
    expect(localizations.activeId).toBe('fr');
    expect(localizations.active).toEqual(LOCALIZATION_FR);
  });

  it('can set the active localizaton from an array (first found wins)', () => {
    LocalizeStorage.add('sv', LOCALIZATION_SV);
    LocalizeStorage.add('fr', LOCALIZATION_FR);

    let localizations = LocalizeStorage.get();

    // using set()
    expect(LocalizeStorage.set(['sv', 'fr'])).toBe(true);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // trying set() with a nonexistent Localize follwed by a valid one
    expect(LocalizeStorage.set(['nonexistent', 'fr'])).toBe(true);
    expect(localizations.activeId).toBe('fr');
    expect(localizations.active).toEqual(LOCALIZATION_FR);

    // trying to get a nonexistent country specific locale for an existing
    // locale will be queued at the end and any other existing locales would
    // be set first
    LocalizeStorage.get(['fr-FR', 'nonexistent', 'sv']);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // same test as before but with a different locale format
    LocalizeStorage.get(['fr_FR', 'nonexistent', 'sv']);
    expect(localizations.activeId).toBe('sv');
    expect(localizations.active).toEqual(LOCALIZATION_SV);

    // trying to get only nonexistent country specific locales for a existing
    // locales will queue them at the end
    LocalizeStorage.get(['fr-FR', 'nonexistent', 'sv-SE']);
    expect(localizations.activeId).toBe('fr');
    expect(localizations.active).toEqual(LOCALIZATION_FR);

    // same test as before but with a different locale format
    LocalizeStorage.get(['fr_FR', 'nonexistent', 'sv_SE']);
    expect(localizations.activeId).toBe('fr');
    expect(localizations.active).toEqual(LOCALIZATION_FR);
  });

  it('broadcasts a `LocaleChange` event on the $rootScope', () => {
    LocalizeStorage.add('en', {});
    LocalizeStorage.add('de', {});

    let eventHasFired = false;

    $rootScope.$on('LocaleChange', () => {
      eventHasFired = true;
    });

    LocalizeStorage.set('de');
    expect(eventHasFired).toBe(true);
  });

  it('can set the strict mode', () => {
    let localizations = LocalizeStorage.get();

    // by default strict mode is disabled
    expect(localizations.strictMode).toBe(false);

    // manually enable strict mode
    LocalizeStorage.strict(true);
    expect(localizations.strictMode).toBe(true);

    // manually disable strict mode
    LocalizeStorage.strict(false);
    expect(localizations.strictMode).toBe(false);
  });

});

describe('LocalizeStorage proivider', () => {
  let LocalizeStorageProvider;
  let LocalizeStorage;

  beforeEach(angular.mock.module('localize.storage', (_LocalizeStorageProvider_) => {
    LocalizeStorageProvider = _LocalizeStorageProvider_;
  }));

  beforeEach(angular.mock.inject(($injector) => {
    LocalizeStorage = $injector.get('LocalizeStorage');
  }));

  it('has the same methods as LocalizeStorage', () => {
    expect(LocalizeStorageProvider.add).toBe(LocalizeStorage.add);
    expect(LocalizeStorageProvider.list).toBe(LocalizeStorage.list);
    expect(LocalizeStorageProvider.strict).toBe(LocalizeStorage.strict);
    expect(LocalizeStorageProvider.get).toBe(LocalizeStorage.get);

    // .set() is a special case since it has a $rootScope wrapper in the service
    // and is therefore not identical to the provider
    LocalizeStorageProvider.add('en', LOCALIZATION_EN);
    LocalizeStorageProvider.add('de', LOCALIZATION_DE);

    let localizations = LocalizeStorage.get();

    expect(LocalizeStorageProvider.set('de')).toBe(true);
    expect(localizations.activeId).toBe('de');

    expect(LocalizeStorageProvider.set('nonexistent')).toBe(false);
    expect(localizations.activeId).toBe('de');
  });

});
