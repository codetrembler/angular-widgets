/*jslint indent: 2 */
/*global angular, console */

angular.module('angular-widgets').directive('awSearchInput', ['$document', '$resource', '$location', 'DomService', 'Utils', function ($document, $resource, $location, DomService, Utils) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'search-input.html',
    scope: {
      resultUrl: '@',
      placeholder: '@',
      searchViewUrl: '@',
      onFocus: '=',
      onBlur: '='
    },
    link: function ($scope, $element) {
      var input = $element.find('input'),
        restResource = $resource($scope.resultUrl, null, {
          query: {
            method: 'GET',
            params: { pattern: '@pattern' },
            isArray: true
          }
        });

      Utils.assert(input, 'SearchInput: input element does not exist.');

      $scope.showResults = false;

      $scope.resultClicked = function () {
        input.val('');
      };

      function showResults() {
        var val = input.val(),
          searchResult;

        if (val.length > 0) {
          $element.addClass('loading');
          searchResult = restResource.query({ pattern: val });
          searchResult.$promise.then(function (result) {
            $scope.listItems = result;
            $scope.showResults = true;
          }).catch(function () {
            console.error("no results loaded.");
            $scope.showResults = false;
          }).finally(function () {
            $element.removeClass('loading');
          });
        } else {
          $scope.$apply(function () {
            $scope.showResults = false;
          });
        }
      }

      function onClick(event) {
        // if not clicked into input, the results must be hidden.
        if (event.target.localName !== 'input' || !DomService.elementIsChildOf(event.target, $element[0])) {
          $document.off('click', onClick);
          $scope.$apply(function () {
            $scope.showResults = false;
          });
        }
      }

      function onBlur() {
        if ($scope.onBlur) {
          $scope.onBlur();
        }
      }

      function onFocus() {
        if ($scope.onFocus) {
          $scope.onFocus();
        }

        // Add click event listener to hide dropdown when clicking outside the input.
        $document.on('click', onClick);

        // show quicksearch results after input focus, when quicksearch results are currently hidden.
        if (input.val().length > 0 && !$scope.showResults) {
          $scope.$apply(function () {
            $scope.showResults = true;
          });
        }
      }

      function onKeydown(event) {
        // Tab:    9
        // Enter: 13
        if (event.which === 9) {
          $document.off('click', onClick);
          $scope.$apply(function () {
            $scope.showResults = false;
          });
        } else if (event.which === 13) {
          if ($scope.searchViewUrl) {
            $scope.$apply(function () {
              $location.path($scope.searchViewUrl).search('pattern=' + input.val());
              input.val('');
              $scope.showResults = false;
              $scope.listItems = undefined;
            });
          }
        }
      }

      function init() {
        input.on('focus', onFocus);
        input.on('blur', onBlur);
        input.on('keydown', onKeydown);
        if ($scope.resultUrl) {
          input.on('input', showResults);
        }
      }

      init();
    }
  };
}]);
