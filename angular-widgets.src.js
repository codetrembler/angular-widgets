angular.module("templates-src", [ "search-input.html" ]);

angular.module("search-input.html", []).run([ "$templateCache", function($templateCache) {
    $templateCache.put("search-input.html", '<div><input placeholder="Suche"><spinner></spinner></div>\n' + '<ul ng-if="listItems && listItems.length > 0">\n' + '  <li ng-repeat="listItem in listItems">\n' + '    <p class="title" ng-bind="listItem.title"></p>\n' + '    <p class="subtitle" mathjax-bind="listItem.quickinfo"></p>\n' + "  </li>\n" + "</ul>");
} ]);

angular.module("angular-widgets", [ "ngResource" ]);

angular.module("angular-widgets", [ "ngResource", "ngMockE2E" ]).run(function($httpBackend) {
    "use strict";
    $httpBackend.whenGET("search-input.html").passThrough();
    $httpBackend.whenGET(/quicksearch\/(.*)/).respond(function(method, url) {
        var ret, pattern;
        pattern = url.substring(url.lastIndexOf("/") + 1);
        ret = [ {
            id: "qr1",
            title: pattern,
            quickinfo: "Additional info 1"
        }, {
            id: "qr2",
            title: "Quick Result 2",
            quickinfo: "Additional info 2"
        }, {
            id: "qr3",
            title: "Quick Result 3",
            quickinfo: "Additional info 3"
        } ];
        return [ 200, ret, {} ];
    });
});

angular.module("angular-widgets").directive("searchInput", [ "$resource", function($resource) {
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
            var input = $element.find("input"), spinner = $element.find("spinner"), restResource;
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
                    spinner.css("display", "flex");
                    searchResult = restResource.query({
                        pattern: val
                    });
                    searchResult.$promise.then(function(result) {
                        $scope.listItems = result;
                    }).catch(function() {
                        console.error("no quicksearch results loaded.");
                    }).finally(function() {
                        spinner.css("display", "none");
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

angular.module("angular-widgets", [ "ngMockE2E" ]).run(function($httpBackend) {
    "use strict";
    $httpBackend.whenGET("spinner.html").passThrough();
});

angular.module("angular-widgets").directive("spinner", [ function() {
    "use strict";
    return {
        restrict: "E",
        templateUrl: "spinner.html"
    };
} ]);