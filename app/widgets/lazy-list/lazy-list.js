/*jslint indent: 2 */
/*global angular */

angular.module('angular-widgets').directive('awLazyList', ['$compile', function ($compile) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
    },
    link: function ($scope, $element) {
      // save innerHTML for later use
      var innerTemplate = $element.children(),
        items;
      innerTemplate.remove();

      function createInitialDomElements() {
        var i, clone, scope;
        for (i = 0; i < items.length; i += 1) {
          clone = innerTemplate.clone();
          $element.append(clone);
          scope = $scope.$new();
          scope.item = items[i];
          $compile(clone)(scope);
        }
      }

      function init() {
        var i;
        items = [];
        for (i = 0; i < 100; i += 1) {
          items.push({ label: i, text: 'Text for ' + i + ' element.'});

        }
      }

      init();
      createInitialDomElements();
    }
  };
}]);
