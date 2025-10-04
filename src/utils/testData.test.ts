import { generateRandomTestData, generateRandomResponse } from './testData';

describe('testData', () => {
  test('generates random test data', () => {
    const testData = generateRandomTestData();
    
    // Check if the generated data has required properties
    expect(testData).toHaveProperty('id');
    expect(testData).toHaveProperty('url');
    expect(testData).toHaveProperty('method');
    expect(testData).toHaveProperty('headers');
    expect(testData).toHaveProperty('body');
    expect(testData).toHaveProperty('queryParams');
    expect(testData).toHaveProperty('environment');
    
    // Check if method is one of the valid HTTP methods
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    expect(validMethods).toContain(testData.method);
  });

  test('generates random response data', () => {
    const response = generateRandomResponse();
    
    // Check if the generated response has required properties
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('statusText');
    expect(response).toHaveProperty('headers');
    expect(response).toHaveProperty('body');
    expect(response).toHaveProperty('responseTime');
    expect(response).toHaveProperty('timestamp');
    
    // Check if status code is a number
    expect(typeof response.statusCode).toBe('number');
    
    // Check if response time is a number
    expect(typeof response.responseTime).toBe('number');
  });
});