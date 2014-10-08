angular.module("templates-src", [ "search-input.html", "spinner-dots.html", "spinner.html" ]);

angular.module("search-input.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("search-input.html", '<input placeholder="Suche"><aw-spinner-dots></aw-spinner-dots>\n' + '<ul ng-if="listItems && listItems.length > 0">\n' + '  <li ng-repeat="listItem in listItems">\n' + '    <p class="title" ng-bind="listItem.title"></p>\n' + '    <p class="subtitle" mathjax-bind="listItem.quickinfo"></p>\n' + "  </li>\n" + "</ul>");
} ]);

angular.module("spinner-dots.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("spinner-dots.html", "<div>\n" + '  <div class="bounce1"></div>\n' + '  <div class="bounce2"></div>\n' + '  <div class="bounce3"></div>\n' + "</div>");
} ]);

angular.module("spinner.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("spinner.html", "<div>\n" + '  <div class="bounce1"></div>\n' + '  <div class="bounce2"></div>\n' + '  <div class="bounce3"></div>\n' + "</div>");
} ]);

angular.module("angular-widgets",["ngResource", "templates-src"]);

angular.module("angular-widgets").directive("awSearchInput", [ "$resource", function($resource) {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "search-input.html",
        scope: {
            quicksearchUrl: "@",
            onFocus: "=",
            onBlur: "="
        },
        link: function($scope, $element) {
            var input = $element.find("input"), restResource;
            if ($scope.quicksearchUrl) {
                restResource = $resource($scope.quicksearchUrl, null, {
                    query: {
                        method: "GET",
                        params: {
                            pattern: "@pattern"
                        },
                        isArray: true
                    }
                });
            }
            function showQuickSearchResults() {
                var val = input.val(), searchResult;
                if (val.length > 0) {
                    $element.addClass("loading");
                    searchResult = restResource.query({
                        pattern: val
                    });
                    searchResult.$promise.then(function(result) {
                        $scope.listItems = result;
                    }).catch(function() {
                        console.error("no quicksearch results loaded.");
                    }).finally(function() {
                        $element.removeClass("loading");
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.listItems = undefined;
                    });
                }
            }
            function onBlur() {
                if ($scope.onBlur) {
                    $scope.onBlur();
                }
                $scope.$apply(function() {
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
                input.on("focus", onFocus);
                if ($scope.quicksearchUrl) {
                    input.on("input", showQuickSearchResults);
                }
                input.on("blur", onBlur);
            }
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