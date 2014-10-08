/*jslint indent: 2, unparam: true */
/*global angular, console */

angular.module('angular-widgets').directive('awSearchInput', ['$resource', function ($resource) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'search-input.html',
    scope: {
      quicksearchUrl: '@',
      onFocus: '=',
      onBlur: '='
    },
    link: function ($scope, $element) {
      var input = $element.find('input'),
        restResource;

      if ($scope.quicksearchUrl) {
        restResource = $resource($scope.quicksearchUrl,
          null,
          {
            query: {
              method: 'GET',
              params: { pattern: '@pattern' },
              isArray: true
            }
          });
      }

      function showQuickSearchResults() {
        var val = input.val(),
          searchResult;

        if (val.length > 0) {
          $element.addClass('loading');
          searchResult = restResource.query({ pattern: val });
          searchResult.$promise.then(function (result) {
            $scope.listItems = result;
          }).catch(function () {
            console.error("no quicksearch results loaded.");
          }).finally(function () {
            $element.removeClass('loading');
          });
        } else {
          $scope.$apply(function () {
            $scope.listItems = undefined;
          });
        }
      }

      function onBlur() {
        if ($scope.onBlur) {
          $scope.onBlur();
        }
        $scope.$apply(function () {
          $scope.listItems = undefined;
        });
      }

      function onFocus() {
        if ($scope.onFocus) {
          $scope.onFocus();
        }
        showQuickSearchResults();
      }

      if (input) {
        input.on('focus', onFocus);
        if ($scope.quicksearchUrl) {
          input.on('input', showQuickSearchResults);
        }
        input.on('blur', onBlur);
      }
    }
  };
}]);
