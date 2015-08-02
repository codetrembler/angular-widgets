/*global angular */
/*jslint indent: 2, regexp: true, unparam: true */

angular.module('list-example', ['angular-widgets', 'ngResource', 'ngMockE2E']).run(function ($httpBackend) {
  'use strict';

  var itemsCount = 50000;

  $httpBackend.whenGET(/itemcount/).respond(function (method, url) {
    return [200, itemsCount, {}];
  });

  $httpBackend.whenGET(/loaditems/).respond(function (method, url, dataStr) {
    var i,
      items = [],
      data = JSON.parse(dataStr);

    for (i = data.offset; i < data.offset + data.count; i += 1) {
      items.push({ label: i, text: 'Text for ' + i + ' element.'});
    }
    return [200, items, {}];
  });
});

angular.module('list-example').controller('listController', function ($scope) {
  'use strict';

  var i;

  $scope.items = [];
  for (i = 0; i < 500; i += 1) {
    $scope.items.push({ label: i, text: 'Text for ' + i + ' element.'});
  }
});