import React, { useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * ResultScreen — Post-game result & career match screen
 *
 * Design references:
 * - Booking.com: property detail card density + clear CTA hierarchy
 * - NS.nl: journey overview + step-by-step route visualization
 * - Rituals: the "discovery" reveal feeling with warmth
 *
 * Structure:
 * - Top: Congratulations + score summary bar
 * - Left col: Role match card (dark navy, premium feel)
 * - Right col: Career path timeline + style tags + CTA
 * - Bottom: All sector badges showing breadth of discovery
 */

const ROLE_ICONS: Record<string, string> = {
  receptionist:       'support_agent',
  bootmonteur:        'build',
  marketing:          'campaign',
  animator:           'celebration',
  hafenmeister:       'anchor',
  havenmeester:       'anchor',
  camping_manager:    'manage_accounts',
  parkmanager:        'manage_accounts',
  zwembadtechnicus:   'plumbing',
  hovenier:           'yard',
  zeilinstructeur:    'sailing',
  kok:                'restaurant',
  gastenservice:      'headset_mic',
  socialmedia:        'photo_camera',
  evenementenplanner: 'event',
  technischdienst:    'construction',
};

const iconFor = (id?: string) =>
  id ? (ROLE_ICONS[id] ?? 'work_outline') : 'work_outline';

const CAREER_STEPS = [
  {
    step: 1,
    title: 'MBO Recreatie & Toerisme',
    desc: 'Niveau 2-4 · Gastvrijheid, Sport & Bewegen',
    done: true,
  },
  {
    step: 2,
    title: 'Vakspecialisatie',
    desc: 'Branchecertificaten & praktijkmodules',
    done: false,
  },
  {
    step: 3,
    title: 'Stage bij een recreatiebedrijf',
    desc: 'Camping, marina, vakantiepark of waterpark',
    done: false,
  },
];

const SKILL_TAGS = [
  { label: 'Klantgericht', icon: 'people' },
  { label: 'Buitenlucht', icon: 'park' },
  { label: 'Teamwork', icon: 'diversity_3' },
  { label: 'Avontuurlijk', icon: 'kayaking' },
];

export const ResultScreen: React.FC = () => {
  const { matchedRole, matchScorePercentage, score, resetGame } = useGameStore();
  const [copied, setCopied] = useState(false);

  const role = matchedRole;
  if (!role) return null;

  const pct = matchScorePercentage ?? 0;
  const icon = iconFor(role.id);

  const handleShare = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="stripe-bg min-h-[calc(100vh-95px)] flex flex-col">

      {/* ── HERO RESULT BANNER ──────────────────────────────── */}
      <div className="bg-[#003e6f] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="animate-in">
            <div className="chip chip-white mb-3">
              <span className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              Spel voltooid
            </div>
            <h1 className="font-heading font-black text-white text-[2.2rem] leading-tight mb-1">
              Gefeliciteerd!
            </h1>
            <p className="text-white/70 text-lg">
              Je hebt alle situaties doorgespeeld en jouw profiel is berekend.
            </p>
          </div>

          {/* Score block — Booking.com style rating box */}
          <div
            className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-white/10 border border-white/20 shrink-0 animate-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="font-heading font-black text-white text-[2.4rem] leading-none tabular-nums">
              {score}
            </span>
            <span className="text-white/60 text-[12px] font-bold uppercase tracking-wider mt-1">
              punten
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">

          {/* ── LEFT: Role match card ────────────────────────── */}
          <div id="result-card" className="animate-in">
            {/* Match percentage label */}
            <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">person_search</span>
              Jouw beste match ({pct}% overeenkomst)
            </p>

            {/* The role card itself */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #002649 0%, #003e6f 60%, #005096 100%)',
              }}
            >
              {/* Top section */}
              <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)' }}
                >
                  <span
                    className="material-symbols-outlined text-white text-[38px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </div>

                {/* Role info */}
                <div>
                  <p className="text-[#7ecfff] text-[11px] font-bold uppercase tracking-widest mb-1">
                    {role.category ?? 'Recreatiebranche'}
                  </p>
                  <h2 className="font-heading font-black text-white text-[1.8rem] leading-tight">
                    {role.title}
                  </h2>
                  <p className="text-white/70 text-[14px] mt-2 leading-relaxed max-w-xs mx-auto">
                    {role.shortDescription}
                  </p>
                </div>

                {/* Match confidence bar */}
                <div className="w-full bg-white/10 rounded-full overflow-hidden h-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #a8e86c, #2d6a04)',
                    }}
                  />
                </div>
              </div>

              {/* Key skills — white inset */}
              {role.keySkills && (
                <div className="bg-white mx-4 mb-4 rounded-xl p-4">
                  <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.08em] mb-3">
                    Jouw sterkste vaardigheden
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(role.keySkills as string[]).map((skill) => (
                      <span
                        key={skill}
                        className="chip chip-navy text-[11px]"
                        style={{ fontSize: '11px' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {role.salaryRange && (
                    <div className="mt-3 pt-3 border-t border-[#dde1e9] flex items-center justify-between">
                      <span className="text-[#5e6e85] text-[12px] font-bold">Salaris indicatie</span>
                      <span className="font-heading font-black text-[#003e6f] text-[13px]">
                        {role.salaryRange as string}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Career path + CTAs ────────────────────── */}
          <div className="flex flex-col gap-5 animate-in" style={{ animationDelay: '0.08s' }}>

            {/* Career pathway — NS.nl journey style */}
            <div className="card p-5">
              <h3 className="font-heading font-black text-[#003e6f] text-[1rem] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                Hoe kom je daar?
              </h3>

              <ol className="flex flex-col gap-0">
                {CAREER_STEPS.map((step, i) => (
                  <li key={step.step} className="flex gap-4">
                    {/* Timeline column */}
                    <div className="flex flex-col items-center">
                      <div
                        className="step-dot"
                        style={step.done
                          ? { background: 'var(--c-green-light)', color: 'var(--c-green-dark)' }
                          : { background: 'var(--c-border)', color: 'var(--c-text-muted)' }
                        }
                      >
                        {step.done ? (
                          <span className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        ) : step.step}
                      </div>
                      {i < CAREER_STEPS.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#dde1e9] my-1" style={{ minHeight: '24px' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-5 ${i === CAREER_STEPS.length - 1 ? 'pb-0' : ''}`}>
                      <p className="font-heading font-bold text-[#003e6f] text-[14px] leading-tight">
                        {step.title}
                      </p>
                      <p className="text-[#5e6e85] text-[12px] mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Personality tags */}
            <div>
              <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.1em] mb-3">
                Jouw recreatieprofiel
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map(({ label, icon: tagIcon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#dde1e9] bg-white"
                  >
                    <span className="material-symbols-outlined text-[#003e6f] text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      {tagIcon}
                    </span>
                    <span className="font-heading font-bold text-[#003e6f] text-[13px]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 pt-1">
              <button onClick={handleShare} className="btn-primary w-full justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? 'check' : 'share'}
                </span>
                {copied ? 'Link gekopieerd!' : 'Deel mijn resultaat'}
              </button>
              <button onClick={resetGame} className="btn-secondary w-full justify-center">
                <span className="material-symbols-outlined text-[20px]">replay</span>
                Speel opnieuw
              </button>
              <a
                href="https://www.hiswarecron.nl/carriere"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center text-[#003e6f]"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Meer weten over de branche?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
