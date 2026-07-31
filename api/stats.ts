// Vercel Serverless Function: GET /api/stats
// Returns aggregated non-PII sector statistics

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Demo / fallback stats for UI presentation
  const mockStats = {
    totalSessions: 14280,
    rolesDiscoveredCount: 39820,
    topRoles: [
      { id: 'receptionist', title: 'Gastvrijheid Coördinator', percentage: 24 },
      { id: 'bootmonteur', title: 'Jacht & Maritiem Technicus', percentage: 19 },
      { id: 'marketing', title: 'Recreatie Marketeer', percentage: 18 },
      { id: 'animator', title: 'Belevings & Sport Coach', percentage: 15 },
      { id: 'camping_manager', title: 'Park & Recreatie Manager', percentage: 14 },
      { id: 'hafenmeister', title: 'Havenmeester & Logistiek', percentage: 10 }
    ],
    updatedAt: new Date().toISOString()
  };

  return res.status(200).json(mockStats);
}
