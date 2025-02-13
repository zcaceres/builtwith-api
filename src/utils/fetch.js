export function getFetch() {
  if (typeof fetch !== 'undefined') {
    return fetch;
  }

  try {
    // Fallback for older Node environments
    return require('node-fetch');
  } catch {
    throw new Error('Fetch is not available. In Node.js environments before 18, please install node-fetch');
  }
}
