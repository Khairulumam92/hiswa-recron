import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { ScenarioOption } from '../../game/store/types';
import { RoleRevealModal } from './RoleRevealModal';

/**
 * ScenarioCard — Main gameplay screen
 *
 * Design philosophy:
 * - Inspired by Booking.com "property card" density + NS.nl utility
 * - Full viewport, split layout: context panel left, choices right
 * - NO generic gradient overlays — real typographic hierarchy
 * - Timer is a strict horizontal bar + large number (not buried)
 * - Choice cards: text-first, icon supporting (not icon-first)
 * - Streak counter is a real, distinct badge (Booking.com style urgency)
 */

const ROLE_ICONS: Record<string, string> = {
  zwembadtechnicus: 'plumbing',
  bootmonteur:      'build',
  animator:         'celebration',
  animateur:        'celebration',
  receptionist:     'support_agent',
  gastenservice:    'headset_mic',
  hafenmeister:     'anchor',
  havenmeester:     'anchor',
  zeilinstructeur:  'sailing',
  marketing:        'campaign',
  socialmedia:      'photo_camera',
  camping_manager:  'manage_accounts',
  parkmanager:      'manage_accounts',
  kok:              'restaurant',
  hovenier:         'yard',
  evenementenplanner: 'event',
  technischdienst:  'construction',
  lifeguard:        'health_and_safety',
};

const iconFor = (roleId: string) =>
  ROLE_ICONS[roleId] ?? ROLE_ICONS[roleId.toLowerCase()] ?? 'work_outline';

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Makkelijk', color: '#2d6a04', bg: '#edf7e3' },
  medium: { label: 'Gemiddeld', color: '#7a4500', bg: '#fff4e6' },
  hard:   { label: 'Moeilijk',  color: '#8b0000', bg: '#fde8e6' },
};

/** Map scenario locations to their isometric scene illustrations */
const LOCATION_IMAGES: Record<string, string> = {
  // Marina & Watersport
  'Jachthaven Steiger B':      '/assets/images/scene_marina.jpg',
  'Haven Steiger A':           '/assets/images/scene_marina.jpg',
  'Jachthaven Kantoor':        '/assets/images/scene_marina.jpg',
  'Jachthaven Invarend Schip': '/assets/images/scene_marina.jpg',
  // Zwembad
  'Subtropisch Zwembad':       '/assets/images/scene_pool.jpg',
  // Strand
  'Strand & Recreatiemeer':    '/assets/images/scene_pool.jpg',
  // Restaurant
  'Parkrestaurant':            '/assets/images/scene_restaurant.jpg',
  // Kinderclub
  'Kinderclub':                '/assets/images/scene_playground.jpg',
  // Camping
  'Camping Receptie':          '/assets/images/scene_camping.jpg',
  'Camping Terreinen':         '/assets/images/scene_camping.jpg',
  // Receptie & Management
  'Frontoffice Receptie':      '/assets/images/scene_reception.jpg',
  'Park Management Kantoor':   '/assets/images/scene_reception.jpg',
  'Parkmanagement':            '/assets/images/scene_reception.jpg',
  // Marketing
  'Marketing Kantoor':         '/assets/images/scene_reception.jpg',
  'Marketing & Content Office':'/assets/images/scene_reception.jpg',
};

const getSceneImage = (location: string): string => {
  return LOCATION_IMAGES[location] ?? '/assets/images/scene_reception.jpg';
};

export const ScenarioCard: React.FC = () => {
  const {
    scenarios, currentScenarioIndex,
    answerScenario, activeRoleReveal,
    timeRemaining, score, streak,
  } = useGameStore();

  const [selected, setSelected] = useState<ScenarioOption | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [currentScenarioIndex]);

  const scenario = scenarios[currentScenarioIndex] ?? scenarios[0];
  const totalScenarios = scenarios.length;

  const shuffledOptions = useMemo(() => {
    if (!scenario) return [];
    const opts = [...scenario.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [scenario]);

  const timePct = Math.max(0, Math.round((timeRemaining / 120) * 100));
  const isUrgent  = timeRemaining <= 20;
  const isWarning = timeRemaining <= 45;

  const timerFillClass = isUrgent  ? 'timer-fill danger'
                       : isWarning ? 'timer-fill warn'
                       :             'timer-fill';

  const diffCfg = DIFFICULTY_CONFIG[(scenario.difficulty as keyof typeof DIFFICULTY_CONFIG) ?? 'medium'];

  const handlePick = (opt: ScenarioOption) => {
    if (activeRoleReveal || selected) return;
    setSelected(opt);
    answerScenario(opt);
  };

  return (
    <div className="stripe-bg min-h-[calc(100vh-95px)] flex flex-col">

      {/* ── GAME STATUS BAR (like NS.nl train platform info) ─── */}
      <div className="bg-white border-b border-[#dde1e9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4">

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {scenarios.slice(0, Math.min(totalScenarios, 10)).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300 shrink-0"
                style={{
                  width:      i === currentScenarioIndex ? '20px' : '6px',
                  background: i < currentScenarioIndex ? 'var(--c-green)'
                            : i === currentScenarioIndex ? 'var(--c-navy)'
                            : 'var(--c-border)',
                }}
              />
            ))}
            <span className="font-heading font-bold text-[12px] text-[#5e6e85] tabular-nums ml-1">
              {currentScenarioIndex + 1}/{totalScenarios}
            </span>
          </div>

          {/* Center: timer */}
          <div className="flex items-center gap-2.5 flex-1 max-w-[200px] mx-auto">
            <span
              className={[
                'font-heading font-black tabular-nums leading-none',
                isUrgent ? 'text-[#c0392b] animate-pulse text-[20px]' :
                isWarning ? 'text-[#f47d00] text-[18px]' :
                'text-[#003e6f] text-[18px]',
              ].join(' ')}
            >
              {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
              {String(timeRemaining % 60).padStart(2, '0')}
            </span>
            <div className="flex-1 timer-track">
              <div
                className={timerFillClass}
                style={{ width: `${timePct}%` }}
              />
            </div>
          </div>

          {/* Right: score + streak */}
          <div className="flex items-center gap-3 shrink-0">
            {streak > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                <span className="material-symbols-outlined text-amber-500 text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="font-heading font-black text-amber-700 text-[13px] tabular-nums">
                  {streak}×
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#003e6f] text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              <span className="font-heading font-black text-[#003e6f] text-[15px] tabular-nums">
                {score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 gap-6 md:gap-10">

        {/* ── LEFT: Scenario context ───────────────────────────── */}
        <div className="md:w-[44%] flex flex-col gap-5 animate-in">

          {/* Location + time chip row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="chip"
              style={{
                background: diffCfg.bg,
                color: diffCfg.color,
              }}
            >
              {diffCfg.label}
            </span>
            <div className="flex items-center gap-1.5 text-[13px] text-[#5e6e85]">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{scenario.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#5e6e85]">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{scenario.timeOfDay}</span>
            </div>
          </div>

          {/* Scenario title */}
          <h2 className="font-heading font-black text-[#003e6f] leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)' }}>
            {scenario.title}
          </h2>

          {/* Description — styled like a situation brief, not a paragraph */}
          <div className="relative pl-4">
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
              style={{ background: 'var(--c-navy)' }}
            />
            <p className="text-[#384454] text-[15px] leading-relaxed">
              {scenario.description}
            </p>
          </div>

          {/* Scene illustration — isometric pixel art per location */}
          <div className="rounded-xl overflow-hidden border border-[#dde1e9] shadow-sm aspect-video relative">
            <img
              src={getSceneImage(scenario.location)}
              alt={`Scene: ${scenario.location}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between
                            px-3 py-1.5 bg-white/90 backdrop-blur-sm border-t border-[#dde1e9] text-[11px]">
              <span className="flex items-center gap-1 font-bold text-[#5e6e85]">
                <span className="material-symbols-outlined text-[13px]">location_on</span>
                {scenario.location}
              </span>
              <span className="flex items-center gap-1 font-bold text-[#003e6f]">
                <span className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                {score} PTS
              </span>
            </div>
          </div>

          {/* Urgency alert — only shows when time is low */}
          {isUrgent && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-[#c0392b]/30 bg-[#fde8e6] animate-in">
              <span className="material-symbols-outlined text-[#c0392b] text-[22px] shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p className="font-heading font-bold text-[#8b0000] text-sm">
                Haast je! De situatie escaleert — kies snel de juiste persoon!
              </p>
            </div>
          )}

          {/* Chapter indicator */}
          <div className="mt-auto pt-4 flex items-center gap-3 border-t border-[#dde1e9]">
            <div className="w-8 h-8 rounded-full bg-[#003e6f] flex items-center justify-center">
              <span className="font-heading font-black text-white text-[13px]">
                {currentScenarioIndex + 1}
              </span>
            </div>
            <div>
              <p className="font-heading font-black text-[#003e6f] text-[13px] leading-none">
                Situatie {currentScenarioIndex + 1} van {totalScenarios}
              </p>
              <p className="text-[#5e6e85] text-[12px] mt-0.5">
                Elke keuze telt voor jouw eindprofiel
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Answer choices ────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-3.5 animate-in" style={{ animationDelay: '0.08s' }}>
          <p className="font-heading font-bold text-[12px] text-[#5e6e85] uppercase tracking-[0.1em]">
            Wie stuur jij erop af?
          </p>

          {shuffledOptions.map((opt, i) => {
            const isDone         = !!selected;
            const isThisSelected = selected?.roleId === opt.roleId;
            const showCorrect    = isDone && opt.isCorrect;
            const showWrong      = isDone && isThisSelected && !opt.isCorrect;

            const cardClass = showCorrect ? 'choice-card state-correct'
                            : showWrong   ? 'choice-card state-wrong'
                            :               'choice-card';

            const iconBg    = showCorrect ? '#003e6f'
                            : showWrong   ? '#c0392b'
                            : '#f0f2f5';
            const iconColor = (showCorrect || showWrong) ? '#fff' : '#003e6f';

            return (
              <button
                key={opt.roleId + i}
                id={`choice-${i}`}
                onClick={() => handlePick(opt)}
                disabled={!!selected}
                className={`${cardClass} animate-in`}
                style={{ animationDelay: `${0.12 + i * 0.06}s` }}
              >
                {/* Role icon */}
                <div
                  className="role-icon role-icon-md shrink-0 transition-colors"
                  style={{ background: iconBg, color: iconColor }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {iconFor(opt.roleId)}
                  </span>
                </div>

                {/* Label — text is the STAR, icon just supports */}
                <div className="flex-1 text-left">
                  <span className="font-heading font-bold text-[#0f1923] text-[15px] leading-tight">
                    {opt.label}
                  </span>
                </div>

                {/* State indicator */}
                <div className="shrink-0 w-7 h-7 flex items-center justify-center">
                  {showCorrect ? (
                    <span className="material-symbols-outlined text-[#2d6a04] text-[24px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  ) : showWrong ? (
                    <span className="material-symbols-outlined text-[#c0392b] text-[24px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  ) : (
                    <span className="material-symbols-outlined text-[#9aa3b0] text-[24px] group-hover:text-[#003e6f] transition-colors">
                      chevron_right
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* After answer: correct answer explanation */}
          {selected && (
            <div className="card p-4 flex items-start gap-3 animate-in border-l-4 border-[#003e6f] rounded-l-none">
              <span className="material-symbols-outlined text-[#003e6f] text-[22px] mt-0.5 shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <div>
                <p className="font-heading font-bold text-[#003e6f] text-sm mb-0.5">
                  {selected.isCorrect ? 'Goed gedaan!' : 'Niet helemaal...'}
                </p>
                <p className="text-[#384454] text-[13px] leading-relaxed">
                  {scenario.feedbackText ?? 'De volgende situatie begint zo...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role reveal modal */}
      <RoleRevealModal />
    </div>
  );
};
