/*global angular */
/*jslint indent: 2 */

angular.module('angular-widgets').factory('Utils', [function () {
  'use strict';

  var self = {};

  self.assert = function (condition, message) {
    if (!condition) {
      throw new Error('Assert failed: ' + message);
    }
  };

  return self;
}]);
