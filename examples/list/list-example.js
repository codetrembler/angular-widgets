/*global angular */
/*jslint indent: 2, regexp: true, unparam: true */

angular.module('list-example', ['angular-widgets', 'ngResource', 'ngMockE2E']).run(function ($httpBackend) {
  'use strict';

  var itemsCount = 500;

  $httpBackend.whenGET(/itemcount/).respond(function (method, url) {
    return [200, itemsCount, {}];
  });

  $httpBackend.whenGET(/loaditems/).respond(function (method, url, dataStr) {
    var i,
      items = [],
      data = JSON.parse(dataStr);

    for (i = data.offset; i < data.count; i += 1) {
      items.push({ label: i, text: 'Text for ' + i + ' element.'});
    }
    return [200, items, {}];
  });
});
