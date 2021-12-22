import 'jest-extended';
import * as Resources from '../../../src/resources';

describe('Instantiating services', () => {
  it('should create a valid service object for each export', () => {
    Object.entries(Resources).forEach(([k, v]) => {
      const service = new v({
        requesterFn: jest.fn(),
        token: 'abcdefg',
        requestTimeout: 3000,
      });

      expect(service.prototype.name).toBe(k);
      expect(service.url).toBeDefined();
      expect(service.rejectUnauthorized).toBeTruthy();
      expect(service.headers).toMatchObject({ 'private-token': 'abcdefg' });
      expect(service.requestTimeout).toBe(3000);
    });
  });
});