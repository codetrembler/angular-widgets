/*jslint indent: 2 */
/*global angular, console, document */

angular.module('angular-widgets').directive('awSearchInput', ['$resource', 'DomService', 'Utils', function ($resource, DomService, Utils) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'search-input.html',
    scope: {
      quicksearchUrl: '@',
      placeholder: '@',
      onFocus: '=',
      onBlur: '='
    },
    link: function ($scope, $element) {
      var input = $element.find('input'),
        bodyElement = angular.element(document.body),
        restResource = $resource($scope.quicksearchUrl, null, {
          query: {
            method: 'GET',
            params: { pattern: '@pattern' },
            isArray: true
          }
        });

      Utils.assert(input, 'SearchInput: input element does not exist.');
      Utils.assert(bodyElement, 'SearchInput: body element does not exist.');

      $scope.showQuickSearchResults = false;

      $scope.quickSearchResultClicked = function () {
        input.val('');
      };

      function showQuickSearchResults() {
        var val = input.val(),
          searchResult;

        if (val.length > 0) {
          $element.addClass('loading');
          searchResult = restResource.query({ pattern: val });
          searchResult.$promise.then(function (result) {
            $scope.listItems = result;
            $scope.showQuickSearchResults = true;
          }).catch(function () {
            console.error("no quicksearch results loaded.");
            $scope.showQuickSearchResults = false;
          }).finally(function () {
            $element.removeClass('loading');
          });
        } else {
          $scope.$apply(function () {
            $scope.showQuickSearchResults = false;
          });
        }
      }

      function onClick(event) {
        // if not clicked into input, the quicksearch results must be hidden.
        if (event.target.localName !== 'input' || !DomService.elementIsChildOf(event.target, $element[0])) {
          bodyElement.off('click', onClick);
          $scope.$apply(function () {
            $scope.showQuickSearchResults = false;
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
        bodyElement.on('click', onClick);

        // show quicksearch results after input focus, when quicksearch results are currently hidden.
        if (input.val().length > 0 && !$scope.showQuickSearchResults) {
          $scope.$apply(function () {
            $scope.showQuickSearchResults = true;
          });
        }
      }

      function onKeydown(event) {
        // Tab: 9
        if (event.which === 9) {
          bodyElement.off('click', onClick);
          $scope.$apply(function () {
            $scope.showQuickSearchResults = false;
          });
        }
      }

      function init() {
        input.on('focus', onFocus);
        input.on('blur', onBlur);
        input.on('keydown', onKeydown);
        if ($scope.quicksearchUrl) {
          input.on('input', showQuickSearchResults);
        }
      }

      init();
    }
  };
}]);
