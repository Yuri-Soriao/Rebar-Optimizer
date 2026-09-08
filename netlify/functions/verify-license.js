// Verifies a license key submitted by the front-end gate in index.html.
//
// Valid keys live in the LICENSE_KEYS environment variable (set in the
// Netlify dashboard, NOT committed to your repo), as a comma-separated list,
// e.g.:  RBAR-AB12-CD34,RBAR-EF56-GH78,RBAR-IJ90-KL12
//
// Keeping keys in an environment variable (rather than in this file) means:
//   - they never show up in your git history or public repo
//   - you can add/revoke a key from the Netlify dashboard in seconds,
//     with no code change and no redeploy needed
//
// This is a shared-secret check: any key in the list is valid, with no
// per-device or per-seat limit built in. That's enough to stop casual
// forwarding (someone without a key can't get in), but it does NOT stop a
// buyer from giving their own valid key to someone else. If you need real
// per-seat limits (e.g. "this key can only unlock 1 device"), see the
// README for how to add that using a small database (e.g. Supabase) to
// track which keys have already been used and where.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let key;
  try {
    const body = JSON.parse(event.body || '{}');
    key = (body.key || '').trim();
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }

  if (!key) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }

  const raw = process.env.LICENSE_KEYS || '';
  const validKeys = raw.split(',').map(k => k.trim()).filter(Boolean);

  const isValid = validKeys.includes(key);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valid: isValid })
  };
};
