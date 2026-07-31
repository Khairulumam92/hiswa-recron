import React, { useEffect } from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * RoleRevealModal — Post-answer role discovery overlay
 *
 * Design: Bottom sheet on mobile, centered modal on desktop
 * Inspired by Booking.com property info reveal card
 * - Correct: green confirmation with role details
 * - Wrong: warm amber "you discovered a new role" — gamified learning
 */

const ROLE_ICONS: Record<string, string> = {
  zwembadtechnicus:   'plumbing',
  bootmonteur:        'build',
  animator:           'celebration',
  animateur:          'celebration',
  receptionist:       'support_agent',
  gastenservice:      'headset_mic',
  hafenmeister:       'anchor',
  havenmeester:       'anchor',
  zeilinstructeur:    'sailing',
  marketing:          'campaign',
  socialmedia:        'photo_camera',
  camping_manager:    'manage_accounts',
  parkmanager:        'manage_accounts',
  kok:                'restaurant',
  hovenier:           'yard',
  evenementenplanner: 'event',
  technischdienst:    'construction',
};

export const RoleRevealModal: React.FC = () => {
  const { activeRoleReveal, dismissRoleReveal, mode } = useGameStore();

  // Auto-dismiss in stan mode after 3.5s
  useEffect(() => {
    if (!activeRoleReveal || mode !== 'stan') return;
    const t = setTimeout(dismissRoleReveal, 3500);
    return () => clearTimeout(t);
  }, [activeRoleReveal, dismissRoleReveal, mode]);

  if (!activeRoleReveal) return null;

  const { role, isCorrect, feedbackText } = activeRoleReveal;
  const icon = ROLE_ICONS[role.id] ?? ROLE_ICONS[role.id?.toLowerCase()] ?? 'work_outline';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0,38,73,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[420px] overflow-hidden animate-pop shadow-2xl">

        {/* Top status strip */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{
            background: isCorrect
              ? 'linear-gradient(135deg, #1a5e1a, #2d6a04)'
              : 'linear-gradient(135deg, #7a4500, #b36000)',
          }}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-white text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isCorrect ? 'task_alt' : 'lightbulb'}
            </span>
          </div>
          <div>
            <p className="font-heading font-black text-white text-[15px] leading-tight">
              {isCorrect ? 'Goed gekozen!' : 'Nieuwe ontdekking!'}
            </p>
            <p className="text-white/70 text-[12px] leading-none mt-0.5">
              {isCorrect ? 'Jij hebt de juiste persoon gestuurd' : 'Je ontdekt een nieuw beroep in de sector'}
            </p>
          </div>
        </div>

        {/* Role info */}
        <div className="px-6 py-5 flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#ddeeff' }}
          >
            <span
              className="material-symbols-outlined text-[#003e6f] text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-heading font-bold text-[#5e6e85] uppercase tracking-[0.08em] mb-1">
              {role.category ?? 'Recreatiebranche'}
            </p>
            <h3 className="font-heading font-black text-[#003e6f] text-[1.25rem] leading-tight mb-1">
              {role.title}
            </h3>
            <p className="text-[#384454] text-[13px] leading-relaxed">
              {role.shortDescription}
            </p>
          </div>
        </div>

        {/* Feedback text */}
        {feedbackText && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-[#f0f2f5] border border-[#dde1e9] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#003e6f] text-[18px] mt-0.5 shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-[#384454] text-[13px] leading-relaxed">{feedbackText}</p>
          </div>
        )}

        {/* Career path hint */}
        {role.careerPath && (
          <div className="mx-4 mb-4 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#5e6e85] text-[16px]">school</span>
            <p className="text-[#5e6e85] text-[12px]">
              <span className="font-bold text-[#003e6f]">Opleiding: </span>
              {role.careerPath as string}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="px-4 pb-5">
          <button
            onClick={dismissRoleReveal}
            id="next-scenario-btn"
            className="btn-primary w-full justify-center"
          >
            Volgende situatie
            <span className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'wght' 500" }}>arrow_forward</span>
          </button>
          {mode === 'stan' && (
            <p className="text-center text-[11px] text-[#9aa3b0] mt-2">
              Verdwijnt automatisch na 3 seconden
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
