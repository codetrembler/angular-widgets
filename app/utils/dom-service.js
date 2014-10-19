/*global angular */
/*jslint indent: 2 */

angular.module('angular-widgets').factory('DomService', [function () {
  'use strict';

  var self = {};

  self.elementIsChildOf = function (element, parent) {
    var current = element;

    while (current) {
      if (current.parentNode === parent) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  };

  return self;
}]);
