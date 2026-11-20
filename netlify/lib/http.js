const json = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...extraHeaders },
  body: JSON.stringify(data),
});

const parseJsonBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
};

module.exports = { json, parseJsonBody };
