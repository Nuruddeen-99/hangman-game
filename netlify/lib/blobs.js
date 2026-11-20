const { setEnvironmentContext } = require('@netlify/blobs');

// Strong-consistency reads need `uncachedEdgeURL`, which the Blobs runtime
// injects into the Lambda event. connectLambda() drops it, so we decode the
// payload ourselves. If it is ever missing we fall back to eventual consistency
// instead of failing the request.
let strongConsistency = false;

const configureBlobs = (event) => {
  strongConsistency = false;
  if (!event.blobs) return;

  try {
    const data = JSON.parse(Buffer.from(event.blobs, 'base64').toString('utf8'));
    setEnvironmentContext({
      deployID: event.headers?.['x-nf-deploy-id'],
      edgeURL: data.url,
      primaryRegion: data.primary_region,
      siteID: event.headers?.['x-nf-site-id'],
      token: data.token,
      uncachedEdgeURL: data.url_uncached,
    });
    strongConsistency = Boolean(data.url_uncached);
  } catch (error) {
    // Leave the context unset so getStore() raises its usual environment error.
    strongConsistency = false;
  }
};

const getConsistency = () => (strongConsistency ? 'strong' : 'eventual');

module.exports = { configureBlobs, getConsistency };
