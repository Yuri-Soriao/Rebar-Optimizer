// Temporary diagnostic version of verify-license.js

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let key;

  try {
    const body = JSON.parse(event.body || '{}');
    key = (body.key || '').trim();
  } catch (e) {
    console.log('DIAGNOSTIC: Could not parse request body');

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad request' })
    };
  }

  const raw = process.env.LICENSE_KEYS || '';

  // SAFE diagnostic information only.
  // This does NOT print the actual license keys.
  const validKeys = raw
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  const isValid = validKeys.some(
  validKey => validKey.toUpperCase() === key.toUpperCase()
);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valid: isValid
    })
  };
};
