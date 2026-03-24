const { Blobs } = require('@netlify/blobs');

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

    const store = new Blobs({ name: 'mukta-data' });
    const data = await store.get('user-data', { type: 'json' });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};