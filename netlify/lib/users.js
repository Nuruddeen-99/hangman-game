const { getStore } = require('@netlify/blobs');
const { getConsistency } = require('./blobs');

const store = (storeName = 'hangman-users') =>
  getStore({ name: storeName, consistency: getConsistency() });
const normalizeKey = (username) => username.trim().toLowerCase();

module.exports = { store, normalizeKey };
