/*jslint indent: 2 */
/*global angular */

angular.module('angular-widgets').directive('awSpinnerDots', [function () {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'spinner-dots.html'
  };
}]);
