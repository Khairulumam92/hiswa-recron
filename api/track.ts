import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { eventType, mode, matchedRoleId, score } = req.body || {};

    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const eventData: Record<string, unknown> = {};
    if (mode) eventData.mode = mode;
    if (matchedRoleId) eventData.role_id = matchedRoleId;
    if (score !== undefined) eventData.score = score;

    const { error } = await supabase.from('aggregate_stats').insert({
      event_type: eventType || 'unknown',
      event_data: eventData,
    });

    if (error) throw error;

    return res.status(200).json({ success: true, event: eventType });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to record event', details: error.message });
  }
}
