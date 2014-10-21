angular.module("templates-src", [ "search-input.html", "spinner-dots.html", "spinner.html" ]);

angular.module("search-input.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("search-input.html", '<input placeholder="{{ placeholder }}"><aw-spinner-dots></aw-spinner-dots>\n' + '<ul ng-click="quickSearchResultClicked()" ng-if="showQuickSearchResults">\n' + '  <a href="{{ listItem.href }}" ng-repeat="listItem in listItems">\n' + '    <p class="title" ng-bind="listItem.title"></p>\n' + '    <p class="subtitle" mathjax-bind="listItem.quickinfo"></p>\n' + "  </a>\n" + "</ul>");
} ]);

angular.module("spinner-dots.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("spinner-dots.html", "<div>\n" + '  <div class="bounce1"></div>\n' + '  <div class="bounce2"></div>\n' + '  <div class="bounce3"></div>\n' + "</div>");
} ]);

angular.module("spinner.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("spinner.html", "<div>\n" + '  <div class="bounce1"></div>\n' + '  <div class="bounce2"></div>\n' + '  <div class="bounce3"></div>\n' + "</div>");
} ]);

angular.module("angular-widgets",["ngResource", "templates-src"]);

angular.module("angular-widgets").directive("awSearchInput", [ "$document", "$resource", "DomService", "Utils", function($document, $resource, DomService, Utils) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "search-input.html",
        scope: {
            quicksearchUrl: "@",
            placeholder: "@",
            onFocus: "=",
            onBlur: "="
        },
        link: function($scope, $element) {
            var input = $element.find("input"), restResource = $resource($scope.quicksearchUrl, null, {
                query: {
                    method: "GET",
                    params: {
                        pattern: "@pattern"
                    },
                    isArray: true
                }
            });
            Utils.assert(input, "SearchInput: input element does not exist.");
            $scope.showQuickSearchResults = false;
            $scope.quickSearchResultClicked = function() {
                input.val("");
            };
            function showQuickSearchResults() {
                var val = input.val(), searchResult;
                if (val.length > 0) {
                    $element.addClass("loading");
                    searchResult = restResource.query({
                        pattern: val
                    });
                    searchResult.$promise.then(function(result) {
                        $scope.listItems = result;
                        $scope.showQuickSearchResults = true;
                    }).catch(function() {
                        console.error("no quicksearch results loaded.");
                        $scope.showQuickSearchResults = false;
                    }).finally(function() {
                        $element.removeClass("loading");
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.showQuickSearchResults = false;
                    });
                }
            }
            function onClick(event) {
                if (event.target.localName !== "input" || !DomService.elementIsChildOf(event.target, $element[0])) {
                    $document.off("click", onClick);
                    $scope.$apply(function() {
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
                $document.on("click", onClick);
                if (input.val().length > 0 && !$scope.showQuickSearchResults) {
                    $scope.$apply(function() {
                        $scope.showQuickSearchResults = true;
                    });
                }
            }
            function onKeydown(event) {
                if (event.which === 9) {
                    $document.off("click", onClick);
                    $scope.$apply(function() {
                        $scope.showQuickSearchResults = false;
                    });
                }
            }
            function init() {
                input.on("focus", onFocus);
                input.on("blur", onBlur);
                input.on("keydown", onKeydown);
                if ($scope.quicksearchUrl) {
                    input.on("input", showQuickSearchResults);
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