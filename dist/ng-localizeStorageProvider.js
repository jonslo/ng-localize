/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = angular.module('localize.storage', []).provider('LocalizeStorage', LocalizeStorageProvider);

	/**
	 * Handles the storage of localizations for the 'localize' filter
	 */

	function LocalizeStorageProvider() {
	  var storage = {};
	  var publicStorage = {
	    active: null,
	    activeId: null,
	    strictMode: false
	  };

	  // add a localization to the storage, can be immediatly marked as
	  // active by third argument
	  function addLocalization(locale, value, setActive /*optional*/) {
	    storage[locale] = {};
	    angular.copy(value, storage[locale]);

	    if (!!setActive || publicStorage.active === null) {
	      setLocalization(locale);
	    }

	    return publicStorage;
	  };

	  // get the currently active localization or set a new one and get that
	  function getLocalization(locale /*optional*/) {
	    if (locale) {
	      setLocalizationByArray(locale);
	    }

	    return publicStorage;
	  };

	  // list all stored localization keys
	  function listLocalizations() {
	    var list = [];

	    for (var key in storage) {
	      if (storage.hasOwnProperty(key)) {
	        list.push(key);
	      }
	    }

	    return list;
	  };

	  // set the active locale to the first found one, returns boolean wether the action succeded
	  function setLocalizationByArray(locales) {
	    if (!angular.isArray(locales)) {
	      locales = [locales];
	    }

	    for (var i = 0, j = locales.length; i < j; i++) {
	      var locale = locales[i];
	      if (setLocalization(locales[i])) {
	        return true;
	      } else {
	        // normalize requested locales and try to find non country specific version of it
	        // e.g.: "en-US" or "en_US" would add "en" to the end of the array
	        if (locale.indexOf('-') !== -1 || locale.indexOf('_') !== -1) {
	          locales.push(locale.substring(0, Math.max(locale.indexOf('-'), locale.indexOf('_'))));
	          j++;
	        }
	      }
	    }

	    return false;
	  };

	  // set the active locale, returns boolean wether the action succeded
	  function setLocalization(locale) {
	    if (locale && storage[locale]) {
	      publicStorage.activeId = locale;
	      publicStorage.active = storage[locale];

	      return true;
	    }

	    return false;
	  };

	  // enables/disables strict mode. If enabled and no localization is found
	  // in the filter an exception will be thrown, if disabled the requested
	  // string will be output instead
	  function setStrictMode(strictMode) {
	    publicStorage.strictMode = !!strictMode;

	    return publicStorage.strictMode;
	  };

	  this.add = addLocalization;
	  this.get = getLocalization;
	  this.list = listLocalizations;
	  this.set = setLocalizationByArray;
	  this.strict = setStrictMode;

	  this.$get = ["$rootScope", function LocalizeStorageFactory($rootScope) {
	    return {
	      add: addLocalization,
	      get: getLocalization,
	      list: listLocalizations,
	      set: function set() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        // returns boolean if setting the locale was successful
	        if (setLocalizationByArray.apply(null, args)) {
	          $rootScope.$broadcast('LocaleChange');
	          return true;
	        }

	        return false;
	      },

	      strict: setStrictMode
	    };
	  }];
	}

/***/ }
/******/ ]);