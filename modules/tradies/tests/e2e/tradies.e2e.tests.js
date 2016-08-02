'use strict';

describe('Tradies E2E Tests:', function () {
  describe('Test Tradies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tradies');
      expect(element.all(by.repeater('tradie in tradies')).count()).toEqual(0);
    });
  });
});
