/**
 * Map Zone Data — connects physical locations on the isometric map
 * to game scenarios, illustrations, and role categories.
 *
 * Each zone has:
 * - A position (% based) for the interactive marker on the map
 * - Icon + color for the map pin
 * - Linked scenario IDs
 * - Scene illustration path
 */

export interface MapZone {
  id: string;
  name: string;
  subtitle: string;
  icon: string;           // Material Symbol name
  markerColor: string;    // CSS color for the pin
  markerBg: string;       // CSS background for the pin
  /** Position on map as percentage from top-left */
  position: { x: number; y: number };
  /** Scenario IDs tied to this zone */
  scenarioIds: string[];
  /** Scene illustration path */
  scenePath: string;
  /** Number of roles discoverable here */
  roleCount: number;
  /** Category label */
  category: string;
}

export const MAP_ZONES: MapZone[] = [
  {
    id: 'marina',
    name: 'Jachthaven',
    subtitle: 'Haven & Watersport',
    icon: 'sailing',
    markerColor: '#003e6f',
    markerBg: '#ddeeff',
    position: { x: 18, y: 28 },
    scenarioIds: ['S001', 'S006', 'S012', 'S014'],
    scenePath: '/assets/images/scene_marina.jpg',
    roleCount: 4,
    category: 'Marina & Watersport',
  },
  {
    id: 'camping',
    name: 'Camping',
    subtitle: 'Tenten & Bungalows',
    icon: 'holiday_village',
    markerColor: '#2d6a04',
    markerBg: '#edf7e3',
    position: { x: 36, y: 52 },
    scenarioIds: ['S007', 'S011'],
    scenePath: '/assets/images/scene_camping.jpg',
    roleCount: 3,
    category: 'Recreatie & Verblijf',
  },
  {
    id: 'pool',
    name: 'Zwembad',
    subtitle: 'Subtropisch Zwemparadijs',
    icon: 'pool',
    markerColor: '#0077b6',
    markerBg: '#d0eeff',
    position: { x: 75, y: 30 },
    scenarioIds: ['S002', 'S008'],
    scenePath: '/assets/images/scene_pool.jpg',
    roleCount: 2,
    category: 'Faciliteiten & Techniek',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    subtitle: 'Eten & Drinken',
    icon: 'restaurant',
    markerColor: '#7a4500',
    markerBg: '#fff4e6',
    position: { x: 30, y: 78 },
    scenarioIds: ['S003', 'S009'],
    scenePath: '/assets/images/scene_restaurant.jpg',
    roleCount: 2,
    category: 'Food & Beverage',
  },
  {
    id: 'playground',
    name: 'Kinderclub',
    subtitle: 'Animatie & Activiteiten',
    icon: 'emoji_nature',
    markerColor: '#f47d00',
    markerBg: '#fff4e6',
    position: { x: 55, y: 72 },
    scenarioIds: ['S004', 'S010'],
    scenePath: '/assets/images/scene_playground.jpg',
    roleCount: 2,
    category: 'Animatie & Recreatie',
  },
  {
    id: 'garden',
    name: 'Parkterrein',
    subtitle: 'Groen & Onderhoud',
    icon: 'yard',
    markerColor: '#1a5e1a',
    markerBg: '#e4f5eb',
    position: { x: 68, y: 55 },
    scenarioIds: ['S005', 'S011'],
    scenePath: '/assets/images/scene_garden.jpg',
    roleCount: 2,
    category: 'Groen & Onderhoud',
  },
  {
    id: 'reception',
    name: 'Receptie',
    subtitle: 'Ontvangst & Service',
    icon: 'support_agent',
    markerColor: '#003e6f',
    markerBg: '#ddeeff',
    position: { x: 52, y: 50 },
    scenarioIds: ['S007', 'S013', 'S015'],
    scenePath: '/assets/images/scene_reception.jpg',
    roleCount: 4,
    category: 'Frontoffice & Management',
  },
];
