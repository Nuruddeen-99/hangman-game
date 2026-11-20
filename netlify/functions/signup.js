const bcrypt = require('bcryptjs');
const { configureBlobs } = require('../lib/blobs');
const { store, normalizeKey } = require('../lib/users');
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
  if (username.length > 30) return json(400, { message: 'Username is too long' });
  if (password.length < 8) return json(400, { message: 'Password must be at least 8 characters' });

  const users = store();
  const key = normalizeKey(username);

  if (await users.get(key)) return json(409, { message: 'Username already taken' });

  const passwordHash = await bcrypt.hash(password, 10);
  await users.setJSON(key, { username, passwordHash, createdAt: new Date().toISOString() });

  return json(200, { message: 'User added!' });
};
