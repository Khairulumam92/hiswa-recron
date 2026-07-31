import { RoleData, ScenarioPlayRecord } from '../store/types';

export function calculateTopMatchedRole(
  roles: RoleData[],
  roleSelectionCounts: Record<string, number>,
  playHistory: ScenarioPlayRecord[]
): { matchedRole: RoleData; matchScorePercentage: number } {
  if (roles.length === 0) {
    return {
      matchedRole: {
        id: 'receptionist',
        title: 'Frontoffice & Gastvrijheid Coördinator',
        category: 'Gastvrijheid & Service',
        icon: 'Users',
        badgeColor: 'cyan',
        shortDescription: 'Jij bent het visitekaartje van het vakantiepark.',
        fullDescription: '',
        keySkills: ['Gastvrijheid'],
        careerPath: '',
        salaryRange: ''
      },
      matchScorePercentage: 92
    };
  }

  // Find role with highest selection frequency or highest correct matches
  let highestRoleId = roles[0].id;
  let maxCount = -1;

  Object.entries(roleSelectionCounts).forEach(([roleId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      highestRoleId = roleId;
    }
  });

  const matchedRole = roles.find((r) => r.id === highestRoleId) || roles[0];

  // Calculate match percentage based on correct answers and streak
  const totalCorrect = playHistory.filter((p) => p.isCorrect).length;
  const totalPlayed = playHistory.length || 1;
  const rawRatio = totalCorrect / totalPlayed;
  
  // Dynamic scale between 82% and 98% for positive encouraging outcome
  const matchScorePercentage = Math.round(82 + rawRatio * 16);

  return { matchedRole, matchScorePercentage };
}
