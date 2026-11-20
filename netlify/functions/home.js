const bcrypt = require('bcryptjs');
const { configureBlobs } = require('../lib/blobs');
const { store, normalizeKey } = require('../lib/users');
const { createSession } = require('../lib/session');
const { json, parseJsonBody } = require('../lib/http');

exports.handler = async (event) => {
  // Required in Lambda compatibility mode before any getStore() call.
  configureBlobs(event);

  if (event.httpMethod !== 'POST') return json(405, { message: 'Method not allowed' });

  const body = parseJsonBody(event);
  if (!body) return json(400, { message: 'Invalid request' });

  const username = String(body.username || '').trim();
  const password = String(body.password || '');

  if (!username || !password) return json(400, { message: 'Username and password are required' });

  const user = await store().get(normalizeKey(username), { type: 'json' });

  // Same message for both cases so usernames can't be enumerated
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return json(401, { message: 'Incorrect username or password' });
  }

  const setCookie = await createSession(event, user.username);
  return json(
    200,
    { message: 'User confirmed', username: user.username },
    { 'Set-Cookie': setCookie }
  );
};
