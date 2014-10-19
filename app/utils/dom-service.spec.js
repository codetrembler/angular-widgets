/*jslint indent: 2, nomen: true, unparam: true */
/*global angular, describe, beforeEach, it, expect, inject, document */

/**
 * Testing the dom-service
 */

describe('DomService', function () {
  'use strict';

  var DomService;

  beforeEach(angular.mock.module('angular-widgets'));

  beforeEach(inject(function (_DomService_) {
    DomService = _DomService_;
  }));

  it('should detect element as child of its parent', function () {
    var element,
      parent = {},
      isParent;

    element = {
      parentNode: {
        parentNode: parent
      }
    };

    isParent = DomService.elementIsChildOf(element, parent);
    expect(isParent).toBe(true);
  });

  it('should detect element to be not a child of the other', function () {
    var element,
      parent = {},
      isParent;

    element = {
      parentNode: {
        parentNode: undefined
      }
    };

    isParent = DomService.elementIsChildOf(element, parent);
    expect(isParent).toBe(false);
  });
});
