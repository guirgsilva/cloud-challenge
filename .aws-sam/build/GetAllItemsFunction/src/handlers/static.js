import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handler = async (event) => {
  try {
    // Log the current directory and event for debugging
    console.log('Current directory:', __dirname);
    console.log('Event:', JSON.stringify(event, null, 2));

    const websitePath = join(__dirname, '..', '..', 'website');
    console.log('Website path:', websitePath);

    // Check if directory exists
    if (!existsSync(websitePath)) {
      console.error('Website directory not found:', websitePath);
      throw new Error('Website directory not found');
    }

    const indexPath = join(websitePath, 'index.html');
    console.log('Index path:', indexPath);

    // Check if file exists
    if (!existsSync(indexPath)) {
      console.error('Index.html not found:', indexPath);
      throw new Error('Index.html not found');
    }

    const htmlContent = readFileSync(indexPath, 'utf8');
    console.log('HTML content length:', htmlContent.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      },
      body: htmlContent
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message,
        path: __dirname
      })
    };
  }
};