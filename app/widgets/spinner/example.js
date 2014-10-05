/*global angular */
/*jslint indent: 2, regexp: true, unparam: true */

angular.module('angular-widgets', ['ngMockE2E']).run(function ($httpBackend) {
  'use strict';

  $httpBackend.whenGET('spinner.html').passThrough();
});
