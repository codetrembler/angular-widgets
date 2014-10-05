/*jslint indent: 2 */
/*global angular */

angular.module('angular-widgets').directive('spinner', [function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'spinner.html'
  };
}]);
