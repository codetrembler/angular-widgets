/*global angular */
/*jslint indent: 2, regexp: true, unparam: true */

angular.module('lazy-list-example', ['angular-widgets', 'ngResource', 'ngMockE2E']).run(function ($httpBackend) {
  'use strict';

  var itemsCount = 500;

  $httpBackend.whenGET(/item-count/).respond(function (method, url) {
    return [200, itemsCount, {}];
  });

  $httpBackend.whenGET(/load-items/).respond(function (method, url) {
    var i,
      ret = [];

    for (i = 0; i < itemsCount; i += 1) {
      ret.push({
        label: i,
        text: "Text" + i
      });
    }
    return [200, ret, {}];
  });
});
