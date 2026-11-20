const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');
const { getConsistency } = require('./blobs');

const SESSION_COOKIE = 'hangman_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const sessionStore = () => getStore({ name: 'hangman-sessions', consistency: getConsistency() });

const parseCookies = (event) => {
  const header = event.headers?.cookie || event.headers?.Cookie || '';
  return header.split(';').reduce((acc, part) => {
    const index = part.indexOf('=');
    if (index === -1) return acc;
    const name = part.slice(0, index).trim();
    if (!name) return acc;
    acc[name] = decodeURIComponent(part.slice(index + 1).trim());
    return acc;
  }, {});
};

const isLocalRequest = (event) => {
  const host = event.headers?.host || event.headers?.Host || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]');
};

const serializeCookie = (event, value, maxAgeSeconds) => {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (!isLocalRequest(event)) parts.push('Secure');
  return parts.join('; ');
};

const createSession = async (event, username) => {
  const token = crypto.randomUUID();
  const now = Date.now();
  await sessionStore().setJSON(token, {
    username,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return serializeCookie(event, token, Math.floor(SESSION_TTL_MS / 1000));
};

const readSession = async (event) => {
  const token = parseCookies(event)[SESSION_COOKIE];
  if (!token) return null;

  const sessions = sessionStore();
  const session = await sessions.get(token, { type: 'json' });
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    await sessions.delete(token).catch(() => {});
    return null;
  }

  return { token, ...session };
};

const clearSession = async (event) => {
  const token = parseCookies(event)[SESSION_COOKIE];
  if (token) {
    await sessionStore().delete(token).catch(() => {});
  }
  return serializeCookie(event, '', 0);
};

module.exports = {
  SESSION_COOKIE,
  parseCookies,
  createSession,
  readSession,
  clearSession,
};
