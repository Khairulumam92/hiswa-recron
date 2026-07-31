import React from 'react';
import { RoleData } from '../../game/store/types';
import { Icon } from '../ui/Icon';

const CATEGORY_ICONS: Record<string, string> = {
  'frontoffice': 'support_agent',
  'marketing': 'campaign',
  'faciliteiten': 'plumbing',
  'hr': 'groups',
  'fnb': 'restaurant',
  'recreatie': 'celebration',
  'groen': 'grass',
  'marina': 'sailing',
  'management': 'business_center',
};

interface RoleBadgeProps {
  role: RoleData;
  isMatch?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, isMatch = false }) => {
  const icon = CATEGORY_ICONS[role.category?.toLowerCase()] ?? 'work';
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
        isMatch
          ? 'bg-[#ddeeff] border-[#003E6F] shadow-sm'
          : 'bg-white border-[#E4E7EC] hover:border-[#003E6F]/40'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isMatch ? 'bg-[#003E6F] text-white' : 'bg-[#f0f4fb] text-[#003E6F]'
      }`}>
        <Icon name={icon} size={20} filled />
      </div>
      <span className="font-heading font-bold text-[11px] text-[#003E6F] leading-tight">
        {role.title}
      </span>
    </div>
  );
};
