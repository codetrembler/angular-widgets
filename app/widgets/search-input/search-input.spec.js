/*jslint indent: 2, nomen: true, unparam: true */
/*global angular, describe, beforeEach, it, expect, inject, document */

/**
 * Testing the search-input
 */

describe('searchInput', function () {
  'use strict';

  var element,
    $httpBackend,
    $scope;

  beforeEach(angular.mock.module('angular-widgets'));
  beforeEach(angular.mock.module('spinner.html'));
  beforeEach(angular.mock.module('search-input.html'));

  beforeEach(inject(function ($rootScope, $compile, _$httpBackend_) {
    var template = '<search-input quicksearch-url="quicksearch/:pattern"></search-input>';
    $scope = $rootScope.$new();
    element = $compile(template)($scope);
    $scope.$apply();
    $httpBackend = _$httpBackend_;
  }));

  function getDirectiveScope(element) {
    var children,
      first;
    children = element.children();
    first = angular.element(children[0]);
    return first.scope();
  }

  function dispatchEvent(element, name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    element.dispatchEvent(event);
  }

  it('should load quicksearch infos', function (done) {
    // Arrange
    var input = element.find('input'),
      directiveScope;
    document.body.appendChild(element[0]);

    $httpBackend.expectGET('quicksearch/abc').respond([{
      "id": "abc",
      "title": "Alphabet",
      "quickinfo": "subtitle abc"
    }]);

    // Act
    expect(input).toBeDefined();

    input.val('abc');

    input[0].addEventListener('input', function () {
      $httpBackend.flush();
      // Assert
      directiveScope = getDirectiveScope(element);
      expect(directiveScope.listItems).toBeDefined();
      expect(directiveScope.listItems.length).toBe(1);
      expect(directiveScope.listItems[0].id).toBe('abc');
      expect(directiveScope.listItems[0].title).toBe('Alphabet');
      expect(directiveScope.listItems[0].quickinfo).toBe('subtitle abc');

      document.body.removeChild(element[0]);

      done();
    });
    dispatchEvent(input[0], 'input');
  });
});
