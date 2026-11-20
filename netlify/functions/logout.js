const { configureBlobs } = require('../lib/blobs');
const { clearSession } = require('../lib/session');
const { json } = require('../lib/http');

exports.handler = async (event) => {
  // Required in Lambda compatibility mode before any getStore() call.
  configureBlobs(event);

  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });

  const setCookie = await clearSession(event);
  return json(200, { message: 'Logged out' }, { 'Set-Cookie': setCookie });
};
