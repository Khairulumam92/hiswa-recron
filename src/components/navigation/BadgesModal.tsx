import React, { useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { RoleData } from '../../game/store/types';

/**
 * BadgesModal — "Badges" tab view
 * Interactive gallery of all 16 beroepen across 6 categories.
 * Unlocked roles show full details, skills, and career paths.
 */

const CATEGORIES = [
  'Alle',
  'Frontoffice & Gastencontact',
  'Marketing & Sales',
  'Facilitair & Techniek',
  'Marina & Watersport',
  'Animatie & Recreatie',
  'Management & Administratie',
];

export const BadgesModal: React.FC = () => {
  const { roles, selectedRoleCounts, setActiveTab } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<RoleData | null>(null);

  // Filter roles by category
  const filteredRoles = selectedCategory === 'Alle'
    ? roles
    : roles.filter(r => r.category?.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(r.category?.toLowerCase()));

  const isRoleUnlocked = (roleId: string) => (selectedRoleCounts[roleId] ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#dde1e9]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#003e6f] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">military_tech</span>
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white leading-tight flex items-center gap-2">
                16 Beroepen & Badges Gallery
              </h2>
              <p className="text-white/80 text-xs mt-0.5">
                Ontdek alle beroepen in de recreatie en watersport sector
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ontdekken')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Sluiten"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-[#f8fafc] border-b border-[#dde1e9] overflow-x-auto flex gap-2 shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#003e6f] text-white shadow-sm'
                  : 'bg-white text-[#5e6e85] border border-[#dde1e9] hover:bg-[#f0f2f5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* Role Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-6">
            {filteredRoles.map((role) => {
              const unlocked = isRoleUnlocked(role.id);
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleDetail(role)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                    unlocked
                      ? 'bg-white border-[#003e6f]/30 hover:border-[#003e6f] hover:shadow-lg'
                      : 'bg-[#f8fafc] border-[#dde1e9] opacity-80 hover:opacity-100 hover:border-[#003e6f]/40'
                  }`}
                >
                  {/* Badge Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 shadow-sm ${
                      unlocked
                        ? 'bg-[#003e6f] text-white'
                        : 'bg-[#e2e8f0] text-[#64748b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {unlocked ? 'military_tech' : 'lock'}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-xs text-[#0f1923] leading-tight mb-1">
                    {role.title}
                  </h4>
                  
                  <span className="text-[10px] text-[#5e6e85] font-medium leading-none mb-2">
                    {role.category}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    unlocked
                      ? 'bg-[#edf7e3] text-[#2d6a04]'
                      : 'bg-[#f1f5f9] text-[#64748b]'
                  }`}>
                    {unlocked ? 'Ontgrendeld' : 'Bekijk details'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Role Detail Modal / Card */}
          {selectedRoleDetail && (
            <div className="p-5 rounded-2xl border-2 border-[#003e6f]/20 bg-[#ddeeff]/40 backdrop-blur-sm animate-in">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#003e6f] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[26px]">work</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-[#003e6f] leading-tight">
                      {selectedRoleDetail.title}
                    </h3>
                    <p className="text-xs font-bold text-[#5e6e85] mt-0.5">
                      {selectedRoleDetail.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoleDetail(null)}
                  className="text-[#5e6e85] hover:text-[#003e6f] p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <p className="text-sm text-[#384454] leading-relaxed mb-4">
                {selectedRoleDetail.fullDescription || selectedRoleDetail.shortDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-[#003e6f]/15">
                <div>
                  <strong className="text-[#003e6f] block mb-1">🎓 Carrièrepad:</strong>
                  <span className="text-[#384454]">{selectedRoleDetail.careerPath}</span>
                </div>
                <div>
                  <strong className="text-[#003e6f] block mb-1">💶 Salarisindicatie:</strong>
                  <span className="text-[#384454]">{selectedRoleDetail.salaryRange}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#dde1e9] flex items-center justify-between">
          <button
            onClick={() => setActiveTab('pad')}
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">route</span>
            Bekijk Mijn Ontdekkingspad
          </button>
          <button
            onClick={() => setActiveTab('ontdekken')}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
          >
            Sluiten
          </button>
        </div>

      </div>
    </div>
  );
};
