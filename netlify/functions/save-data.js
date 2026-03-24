const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Check secret header
    const secretHeader = event.headers['x-sync-secret'];
    const expectedSecret = process.env.SYNC_SECRET;

    if (!secretHeader || secretHeader !== expectedSecret) {
      console.log('Unauthorized attempt');
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const { data } = JSON.parse(event.body);

    const siteID = process.env.SITE_ID;
    const token = process.env.NETLIFY_BLOBS_ACCESS_TOKEN;
    if (!siteID || !token) {
      console.error('Missing siteID or token');
      return { statusCode: 500, body: 'Server misconfiguration' };
    }

    const store = getStore({ name: 'mukta-data', siteID, token });
    await store.setJSON('user-data', data);

    return { statusCode: 200, body: 'Saved' };
  } catch (err) {
    console.error('Error in save-data:', err);
    return { statusCode: 500, body: `Internal Server Error: ${err.message}` };
  }
};