import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: stats, error } = await supabase
      .from('aggregate_stats')
      .select('event_type, event_data')
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) throw error;

    const totalSessions = stats?.filter((s: any) => s.event_type === 'session_started').length || 0;
    const totalCompletions = stats?.filter((s: any) => s.event_type === 'session_completed').length || 0;

    const roleCounts: Record<string, number> = {};
    stats?.forEach((s: any) => {
      if (s.event_type === 'role_selected' && s.event_data?.role_id) {
        roleCounts[s.event_data.role_id] = (roleCounts[s.event_data.role_id] || 0) + 1;
      }
    });

    const topRoles = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id, count]) => ({ id, count }));

    return res.status(200).json({
      totalSessions,
      totalCompletions,
      completionRate: totalSessions > 0 ? Math.round((totalCompletions / totalSessions) * 100) : 0,
      topRoles,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(200).json({
      totalSessions: 0,
      totalCompletions: 0,
      completionRate: 0,
      topRoles: [],
      updatedAt: new Date().toISOString(),
      error: error.message,
    });
  }
}
