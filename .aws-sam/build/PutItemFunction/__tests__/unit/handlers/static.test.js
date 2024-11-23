import { jest } from '@jest/globals';
import { handler } from '../../../src/handlers/static.js';
import fs from 'fs';
import path from 'path';

// Mock fs and path modules
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}));

jest.mock('path', () => ({
    join: jest.fn((...args) => args.join('/')),
    dirname: jest.fn(() => 'mocked-dirname')
}));

describe('Test staticHandler', () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
    });

    it('should serve index.html successfully', async () => {
        // Mock file existence checks
        fs.existsSync.mockImplementation(() => true);
        
        // Mock file content
        const mockHtmlContent = '<html><body>Hello World</body></html>';
        fs.readFileSync.mockReturnValue(mockHtmlContent);

        const event = {};

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
            },
            body: mockHtmlContent
        });

        // Verify fs calls
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('index.html'), 'utf8');
    });

    it('should handle missing website directory', async () => {
        // Mock website directory doesn't exist
        fs.existsSync.mockImplementation(() => false);

        const event = {};

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: expect.stringContaining('Website directory not found')
        });
    });
});