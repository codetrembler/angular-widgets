/*jslint indent: 2 */
/*global angular */

angular.module('angular-widgets').directive('awSpinner', [function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'spinner.html'
  };
}]);
