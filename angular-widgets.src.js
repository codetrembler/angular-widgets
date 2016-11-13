angular.module("templates-src", [ "search-input.html", "spinner-dots.html" ]);

angular.module("search-input.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("search-input.html", '<input placeholder="{{ placeholder }}"><aw-spinner-dots></aw-spinner-dots>\n' + '<ul ng-click="resultClicked()" ng-if="showResults">\n' + '  <a href="{{ listItem.href }}" ng-repeat="listItem in listItems">\n' + '    <p class="title" ng-bind="listItem.title"></p>\n' + '    <p class="subtitle" mathjax-bind="listItem.quickinfo"></p>\n' + "  </a>\n" + "</ul>\n" + "");
} ]);

angular.module("spinner-dots.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("spinner-dots.html", "<div>\n" + '  <div class="bounce1"></div>\n' + '  <div class="bounce2"></div>\n' + '  <div class="bounce3"></div>\n' + "</div>\n" + "");
} ]);

angular.module("angular-widgets",["ngResource", "templates-src"]);

angular.module("angular-widgets").directive("awList", [ "$compile", "$http", function($compile, $http) {
    "use strict";
    return {
        restrict: "E",
        scope: {
            items: "=",
            urlItemCount: "@",
            urlItems: "@"
        },
        link: function($scope, $element) {
            var itemTemplate = $element.children(), itemContainerDiv = angular.element('<div class="item-container"></div>'), isLoadItemsOnScroll = $scope.urlItems !== undefined, items, itemCount, domElements, domElementScopes, domElementsCount = 100, lazyLoadBlockCount = 5, lazyLoadBlockItemCount = 40, lazyLoadFirstLoadedBlock = 0, containerHeight = 0, domElementHeight = 0, lastScrollTop = 0, indexTopItem = 0, indexBottomItem = domElementsCount - 1, elementTopPixelsToStartElementSwapping = 0;
            itemTemplate.remove();
            itemTemplate.addClass("item");
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
                    domElements[i].css("top", domElements[0][0].offsetHeight * i + "px");
                    domElementScopes.push(scope);
                }
            }
            function initializeDomElements() {
                var i, count = Math.min(domElementsCount, items.length);
                for (i = 0; i < count; i += 1) {
                    domElementScopes[i].item = items[i];
                }
                domElementHeight = domElements[0][0].offsetHeight;
                containerHeight = domElementHeight * itemCount;
                itemContainerDiv[0].style.minHeight = containerHeight + "px";
                elementTopPixelsToStartElementSwapping = (domElementHeight * domElementsCount - $element[0].offsetHeight) / 2;
            }
            function initItems() {
                items = $scope.items;
                if (items) {
                    itemCount = items.length;
                    initializeDomElements();
                }
            }
            function init() {
                createInitialDomElements();
                if (!isLoadItemsOnScroll) {
                    initItems();
                } else {
                    $http.get("/" + $scope.urlItemCount).success(function(loadedItemCount) {
                        itemCount = loadedItemCount;
                        items = [];
                        items[itemCount - 1] = undefined;
                        $http.get("/" + $scope.urlItems, {
                            data: {
                                offset: 0,
                                count: lazyLoadBlockCount * lazyLoadBlockItemCount
                            }
                        }).success(function(loadedItems) {
                            var args = [ 0, lazyLoadBlockItemCount ].concat(loadedItems);
                            Array.prototype.splice.apply(items, args);
                            initializeDomElements();
                        });
                    });
                }
            }
            function loadItemsOnScrollDown() {
                var topItemIndex, lastItemIndexOfMiddleBlock, offset;
                if (isLoadItemsOnScroll) {
                    topItemIndex = $element[0].scrollTop / domElementHeight;
                    lastItemIndexOfMiddleBlock = Math.ceil(lazyLoadBlockCount / 2 + lazyLoadFirstLoadedBlock) * lazyLoadBlockItemCount - 1;
                    if (topItemIndex > lastItemIndexOfMiddleBlock) {
                        offset = (lazyLoadFirstLoadedBlock + lazyLoadBlockCount) * lazyLoadBlockItemCount;
                        $http.get("/" + $scope.urlItems, {
                            data: {
                                offset: offset,
                                count: lazyLoadBlockItemCount
                            }
                        }).success(function(loadedItems) {
                            var args = [ offset, lazyLoadBlockItemCount ].concat(loadedItems);
                            lazyLoadFirstLoadedBlock += 1;
                            Array.prototype.splice.apply(items, args);
                        });
                    }
                }
            }
            function updateDomElementsOnScrollDown() {
                var scrollTop = $element[0].scrollTop, scrolledItemsCount, i;
                if (scrollTop - lastScrollTop > domElementHeight) {
                    scrolledItemsCount = Math.floor((scrollTop - lastScrollTop) / domElementHeight);
                    if (scrollTop > elementTopPixelsToStartElementSwapping) {
                        for (i = 0; i < scrolledItemsCount; i += 1) {
                            indexBottomItem = indexTopItem - 1 + domElementsCount;
                            if (indexBottomItem === itemCount - 1) {
                                break;
                            }
                            domElements[indexTopItem % domElementsCount].css("top", parseInt(domElements[indexBottomItem % domElementsCount].css("top"), 10) + domElementHeight + "px");
                            domElementScopes[indexTopItem % domElementsCount].item = items[indexBottomItem + 1];
                            indexTopItem += 1;
                            indexBottomItem += 1;
                        }
                        $scope.$apply();
                    }
                    lastScrollTop = scrollTop - (scrollTop - lastScrollTop) % domElementHeight;
                }
            }
            function updateDomElementsOnScrollUp() {
                var scrollTop = $element[0].scrollTop, scrolledItemsCount, i;
                if (lastScrollTop - scrollTop > domElementHeight) {
                    scrolledItemsCount = Math.floor((lastScrollTop - scrollTop) / domElementHeight);
                    if (scrollTop < containerHeight - elementTopPixelsToStartElementSwapping) {
                        for (i = 0; i < scrolledItemsCount; i += 1) {
                            indexTopItem = indexBottomItem + 1 - domElementsCount;
                            if (indexTopItem === 0) {
                                break;
                            }
                            domElements[indexBottomItem % domElementsCount].css("top", parseInt(domElements[indexTopItem % domElementsCount].css("top"), 10) - domElementHeight + "px");
                            domElementScopes[indexBottomItem % domElementsCount].item = items[indexTopItem - 1];
                            indexTopItem -= 1;
                            indexBottomItem -= 1;
                        }
                        $scope.$apply();
                    }
                    lastScrollTop = scrollTop + (lastScrollTop - scrollTop) % domElementHeight;
                }
            }
            function onScroll() {
                if ($element[0].scrollTop > lastScrollTop) {
                    loadItemsOnScrollDown();
                    updateDomElementsOnScrollDown();
                } else {
                    updateDomElementsOnScrollUp();
                }
            }
            $scope.$watch("items", function() {
                if (!isLoadItemsOnScroll) {
                    initItems();
                }
            });
            $element.on("scroll", onScroll);
            init();
        }
    };
} ]);

angular.module("angular-widgets").directive("awSearchInput", [ "$document", "$resource", "$location", "DomService", "Utils", function($document, $resource, $location, DomService, Utils) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "search-input.html",
        scope: {
            resultUrl: "@",
            placeholder: "@",
            searchViewUrl: "@",
            onFocus: "=",
            onBlur: "="
        },
        link: function($scope, $element) {
            var input = $element.find("input"), restResource = $resource($scope.resultUrl, null, {
                query: {
                    method: "GET",
                    params: {
                        pattern: "@pattern"
                    },
                    isArray: true
                }
            });
            Utils.assert(input, "SearchInput: input element does not exist.");
            $scope.showResults = false;
            $scope.resultClicked = function() {
                input.val("");
            };
            function showResults() {
                var val = input.val(), searchResult;
                if (val.length > 0) {
                    $element.addClass("loading");
                    searchResult = restResource.query({
                        pattern: val
                    });
                    searchResult.$promise.then(function(result) {
                        $scope.listItems = result;
                        $scope.showResults = true;
                    }).catch(function() {
                        console.error("no results loaded.");
                        $scope.showResults = false;
                    }).finally(function() {
                        $element.removeClass("loading");
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.showResults = false;
                    });
                }
            }
            function onClick(event) {
                if (event.target.localName !== "input" || !DomService.elementIsChildOf(event.target, $element[0])) {
                    $document.off("click", onClick);
                    $scope.$apply(function() {
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
                $document.on("click", onClick);
                if (input.val().length > 0 && !$scope.showResults) {
                    $scope.$apply(function() {
                        $scope.showResults = true;
                    });
                }
            }
            function onKeydown(event) {
                if (event.which === 9) {
                    $document.off("click", onClick);
                    $scope.$apply(function() {
                        $scope.showResults = false;
                    });
                } else if (event.which === 13) {
                    if ($scope.searchViewUrl) {
                        $scope.$apply(function() {
                            $location.path($scope.searchViewUrl).search("pattern=" + input.val());
                            input.val("");
                            $scope.showResults = false;
                            $scope.listItems = undefined;
                        });
                    }
                }
            }
            function init() {
                input.on("focus", onFocus);
                input.on("blur", onBlur);
                input.on("keydown", onKeydown);
                if ($scope.resultUrl) {
                    input.on("input", showResults);
                }
            }
            init();
        }
    };
} ]);

angular.module("angular-widgets").directive("awSpinnerDots", [ function() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "spinner-dots.html"
    };
} ]);

angular.module("angular-widgets").factory("DomService", [ function() {
    "use strict";
    var self = {};
    self.elementIsChildOf = function(element, parent) {
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
} ]);

angular.module("angular-widgets").factory("Utils", [ function() {
    "use strict";
    var self = {};
    self.assert = function(condition, message) {
        if (!condition) {
            throw new Error("Assert failed: " + message);
        }
    };
    return self;
} ]);