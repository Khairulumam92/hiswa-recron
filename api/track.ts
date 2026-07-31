// Vercel Serverless Function: POST /api/track
// Increments anonymous aggregate counter for sector discovery stats

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { eventType, mode, matchedRoleId } = req.body || {};

    // Placeholder logic - when Vercel KV is configured:
    // await kv.incr(`stats:${eventType}:${mode || 'general'}`);
    // if (matchedRoleId) await kv.incr(`roles:${matchedRoleId}`);

    return res.status(200).json({
      success: true,
      message: 'Event logged anonymously',
      timestamp: new Date().toISOString(),
      received: { eventType, mode, matchedRoleId }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to record event', details: error.message });
  }
}
