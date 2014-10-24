/*jslint indent: 2 */
/*global angular, console */

angular.module('angular-widgets').directive('awSearchInput', ['$document', '$resource', '$location', 'DomService', 'Utils', function ($document, $resource, $location, DomService, Utils) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'search-input.html',
    scope: {
      quicksearchUrl: '@',
      placeholder: '@',
      onEnterUrl: '@',
      onFocus: '=',
      onBlur: '='
    },
    link: function ($scope, $element) {
      var input = $element.find('input'),
        restResource = $resource($scope.quicksearchUrl, null, {
          query: {
            method: 'GET',
            params: { pattern: '@pattern' },
            isArray: true
          }
        });

      Utils.assert(input, 'SearchInput: input element does not exist.');

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
          $document.off('click', onClick);
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
        $document.on('click', onClick);

        // show quicksearch results after input focus, when quicksearch results are currently hidden.
        if (input.val().length > 0 && !$scope.showQuickSearchResults) {
          $scope.$apply(function () {
            $scope.showQuickSearchResults = true;
          });
        }
      }

      function onKeydown(event) {
        // Tab:    9
        // Enter: 13
        if (event.which === 9) {
          $document.off('click', onClick);
          $scope.$apply(function () {
            $scope.showQuickSearchResults = false;
          });
        } else if (event.which === 13) {
          if ($scope.onEnterUrl) {
            $scope.$apply(function () {
              $location.path($scope.onEnterUrl).search('pattern=' + input.val());
              input.val('');
              $scope.showQuickSearchResults = false;
              $scope.listItems = undefined;
            });
          }
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
