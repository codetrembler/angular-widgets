/*jslint indent: 2 */
/*global angular, console */

angular.module('angular-widgets').directive('awLazyList', ['$compile', '$http', function ($compile, $http) {
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
        compiledItems,
        itemScopes,
        itemCount,
        loadBlockCount = 500,
        itemElementsCount = 100,
        containerHeight = 0,
        itemHeight,
        lastTopPosition = 0,
        indexTopItem = 0,
        topElementIndexToStartElementSwapping = 0,
        topElementIndexToStopElementSwapping = 0;
      itemTemplate.remove();
      itemTemplate.addClass('item');
      $element.append(itemContainerDiv);

      function createInitialDomElements() {
        var i, clone, scope;
        compiledItems = [];
        itemScopes = [];

        for (i = 0; i < itemElementsCount; i += 1) {
          clone = itemTemplate.clone();
          itemContainerDiv.append(clone);
          scope = $scope.$new();
          compiledItems.push($compile(clone)(scope));
          compiledItems[i].css('top', (compiledItems[0][0].offsetHeight * i) + 'px');
          itemScopes.push(scope);
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
              count = Math.min(loadBlockCount, itemElementsCount);

            Array.prototype.splice.apply(items, args);

            for (i = 0; i < count; i += 1) {
              itemScopes[i].item = items[i];
            }
            // set container div height with first element's height
            itemHeight = compiledItems[0][0].offsetHeight;
            containerHeight = (itemHeight * itemCount) + 'px';
            itemContainerDiv[0].style.minHeight = containerHeight;
            topElementIndexToStartElementSwapping = (itemHeight * itemElementsCount - $element[0].offsetHeight) / 2;
            topElementIndexToStopElementSwapping = (itemHeight * itemCount) - (itemHeight * itemElementsCount);
            console.log(topElementIndexToStopElementSwapping);
          });
        });
      }

      function onScroll(event) {
        var scrollTop = $element[0].scrollTop,
          scrolledItemsCount,
          i,
          indexBottomItem;

        if (scrollTop - lastTopPosition > itemHeight) {
          scrolledItemsCount = Math.floor((scrollTop - lastTopPosition) / itemHeight);
          //console.log(scrolledItemsCount);

          if (scrollTop > topElementIndexToStartElementSwapping && scrollTop < topElementIndexToStopElementSwapping) {
            console.log(scrolledItemsCount, ' items swapped');
            for (i = 0; i < scrolledItemsCount; i += 1) {
              indexBottomItem = (indexTopItem - 1 + itemElementsCount) % itemElementsCount;
              compiledItems[indexTopItem].css('top', (parseInt(compiledItems[indexBottomItem].css('top'), 10) + itemHeight) + 'px');
              // TODO: set correct item to scope
              //itemScopes[indexTopItem] = 
              indexTopItem += 1;
            }
          }
          lastTopPosition = scrollTop;
        }
      }
      $element.on('scroll', onScroll);
      init();
    }
  };
}]);
