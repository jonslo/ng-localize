import localizeFilter from './ng-localizeFilter.js';
import localizeDirective from './ng-localizeDirective.js';

export default angular.module('localize', [localizeFilter.name, localizeDirective.name]);
