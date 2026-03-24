const { Blobs } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { data, secret } = JSON.parse(event.body);
    const expectedSecret = process.env.SYNC_SECRET;
    
    if (!secret || secret !== expectedSecret) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const store = new Blobs({ name: 'mukta-data' });
    await store.setJSON('user-data', data);
    
    return { statusCode: 200, body: 'Saved' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};