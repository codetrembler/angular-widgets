/*jslint indent: 2 */
/*global angular */

angular.module('angular-widgets').directive('awList', ['$compile', '$http', function ($compile, $http) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      urlItemCount: '@',
      urlItems: '@'
    },
    link: function ($scope, $element) {
      // save innerHTML for later use
      var itemTemplate = $element.children(),
        itemContainerDiv = angular.element('<div class="item-container"></div>'),
        items,
        itemCount,
        domElements,
        domElementScopes,
        domElementsCount = 100,
        loadBlockCount = 500,
        containerHeight = 0,
        domElementHeight = 0,
        lastScrollTop = 0,
        indexTopItem = 0,
        indexBottomItem = domElementsCount - 1,
        elementTopPixelsToStartElementSwapping = 0;

      itemTemplate.remove();
      itemTemplate.addClass('item');
      $element.append(itemContainerDiv);

      function createInitialDomElements() {
        var i, clone, scope;
        domElements = [];
        domElementScopes = [];

        for (i = 0; i < domElementsCount; i += 1) {
          clone = itemTemplate.clone();
          itemContainerDiv.append(clone);
          scope = $scope.$new();
          domElements.push($compile(clone)(scope));
          domElements[i].css('top', (domElements[0][0].offsetHeight * i) + 'px');
          domElementScopes.push(scope);
        }
      }

      function init() {
        createInitialDomElements();
        $http.get('/' + $scope.urlItemCount).success(function (loadedItemCount) {
          itemCount = loadedItemCount;
          items = [];
          items[itemCount - 1] = undefined;

          $http.get('/' + $scope.urlItems, { data: { offset: 0, count: loadBlockCount }}).success(function (loadedItems) {
            var i,
              args = [0, loadBlockCount].concat(loadedItems),
              count = Math.min(loadBlockCount, domElementsCount);

            Array.prototype.splice.apply(items, args);

            for (i = 0; i < count; i += 1) {
              domElementScopes[i].item = items[i];
            }
            // set container div height with first element's height
            domElementHeight = domElements[0][0].offsetHeight;
            containerHeight = (domElementHeight * itemCount);
            itemContainerDiv[0].style.minHeight = containerHeight + 'px';
            elementTopPixelsToStartElementSwapping = (domElementHeight * domElementsCount - $element[0].offsetHeight) / 2;
          });
        });
      }

      function onScrollDown() {
        var scrollTop = $element[0].scrollTop,
          scrolledItemsCount,
          i;

        if (scrollTop - lastScrollTop > domElementHeight) {
          scrolledItemsCount = Math.floor((scrollTop - lastScrollTop) / domElementHeight);

          if (scrollTop > elementTopPixelsToStartElementSwapping) {
            for (i = 0; i < scrolledItemsCount; i += 1) {
              indexBottomItem = (indexTopItem - 1 + domElementsCount);
              if (indexBottomItem === itemCount - 1) {
                break;
              }
              domElements[indexTopItem % domElementsCount].css('top', (parseInt(domElements[indexBottomItem % domElementsCount].css('top'), 10) + domElementHeight) + 'px');
              domElementScopes[indexTopItem % domElementsCount].item = items[indexBottomItem + 1];

              indexTopItem += 1;
              indexBottomItem += 1;

            }
            $scope.$apply();
          }
          // correct the lost pixels from Math.floor
          lastScrollTop = scrollTop - ((scrollTop - lastScrollTop) % domElementHeight);
        }
      }

      function onScrollUp() {
        var scrollTop = $element[0].scrollTop,
          scrolledItemsCount,
          i;

        if (lastScrollTop - scrollTop > domElementHeight) {
          scrolledItemsCount = Math.floor((lastScrollTop - scrollTop) / domElementHeight);

          if (scrollTop < containerHeight - elementTopPixelsToStartElementSwapping) {
            for (i = 0; i < scrolledItemsCount; i += 1) {
              indexTopItem = (indexBottomItem + 1 - domElementsCount);
              if (indexTopItem === 0) {
                break;
              }
              domElements[indexBottomItem % domElementsCount].css('top', (parseInt(domElements[indexTopItem % domElementsCount].css('top'), 10) - domElementHeight) + 'px');
              domElementScopes[indexBottomItem % domElementsCount].item = items[indexTopItem - 1];

              indexTopItem -= 1;
              indexBottomItem -= 1;
            }
            $scope.$apply();
          }
          // correct the lost pixels from Math.floor
          lastScrollTop = scrollTop + ((lastScrollTop - scrollTop) % domElementHeight);
        }
      }

      function onScroll() {
        if ($element[0].scrollTop > lastScrollTop) {
          onScrollDown();
        } else {
          onScrollUp();
        }
      }
      $element.on('scroll', onScroll);
      init();
    }
  };
}]);
