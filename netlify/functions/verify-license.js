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

  console.log('DIAGNOSTIC: LICENSE_KEYS exists:', !!process.env.LICENSE_KEYS);
  console.log('DIAGNOSTIC: Number of configured keys:', validKeys.length);
  console.log('DIAGNOSTIC: Submitted key length:', key.length);
  console.log(
    'DIAGNOSTIC: Test key matches:',
    validKeys.includes('RBAR-TEST-2026-0003')
  );

  const isValid = validKeys.includes(key);

  console.log('DIAGNOSTIC: Submitted key valid:', isValid);

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
