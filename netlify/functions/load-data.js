const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const secret = event.queryStringParameters.secret;
    const expectedSecret = process.env.SYNC_SECRET;
    
    if (!secret || secret !== expectedSecret) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const siteID = process.env.SITE_ID;
    const token = process.env.NETLIFY_BLOBS_ACCESS_TOKEN;
    if (!siteID || !token) {
      console.error('Missing siteID or token');
      return { statusCode: 500, body: 'Missing site configuration' };
    }
    const store = getStore({ name: 'mukta-data', siteID, token });
    
    const data = await store.get('user-data', { type: 'json' });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    };
  } catch (err) {
    console.error('Error in load-data:', err);
    return { statusCode: 500, body: `Internal Server Error: ${err.message}` };
  }
};