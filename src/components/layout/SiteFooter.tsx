import React from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * SiteFooter — Minimal but real footer
 *
 * Structure:
 * - 3-column grid: Brand info | Over het spel | Sector links
 * - Bottom strip: copyright + HISWA-RECRON badge
 *
 * Only shows on intro and result screens (not during gameplay to avoid distraction)
 */
export const SiteFooter: React.FC = () => {
  const { phase } = useGameStore();

  // Don't render footer during active gameplay or map view
  if (phase === 'playing' || phase === 'map') return null;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-grid">
        {/* ── Col 1: Brand ──────────────────────────────────── */}
        <div className="footer-brand">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-[#7ecfff] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              waves
            </span>
            <span className="font-heading font-extrabold text-white text-[16px] tracking-tight">
              Jong RECRON
            </span>
            <span
              className="material-symbols-outlined text-[#a8e86c] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <p>
            Een interactief beroependiscovery-spel voor de recreatie- en watersportbranche. Ontdek jouw plek in de sector!
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://www.hiswarecron.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              HISWA-RECRON
            </a>
            <a
              href="https://www.hiswa.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              style={{ fontSize: '12px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined text-[14px]">sailing</span>
              HISWA
            </a>
          </div>
        </div>

        {/* ── Col 2: Over het spel ──────────────────────────── */}
        <div>
          <p className="footer-heading">Over het spel</p>
          <ul className="footer-links">
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Hoe werkt het?
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Alle 28 beroepen
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Voor docenten
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Privacy & cookies
              </a>
            </li>
          </ul>
        </div>

        {/* ── Col 3: Sectoren ───────────────────────────────── */}
        <div>
          <p className="footer-heading">Sectoren</p>
          <ul className="footer-links">
            <li>
              <a href="https://www.hiswarecron.nl/watersport" target="_blank" rel="noopener noreferrer">
                Watersport & Marina
              </a>
            </li>
            <li>
              <a href="https://www.hiswarecron.nl/recreatie" target="_blank" rel="noopener noreferrer">
                Recreatie & Camping
              </a>
            </li>
            <li>
              <a href="https://www.hiswarecron.nl/vakantieparken" target="_blank" rel="noopener noreferrer">
                Vakantieparken
              </a>
            </li>
            <li>
              <a href="https://www.hiswarecron.nl/opleidingen" target="_blank" rel="noopener noreferrer">
                Opleidingen
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HISWA-RECRON · Jong RECRON</span>
        <span className="hidden sm:block">·</span>
        <span>Gemaakt voor de recreatie- en watersportbranche</span>
        <span className="hidden sm:block">·</span>
        <span className="flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[12px] text-white/30"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock
          </span>
          Geen persoonsgegevens opgeslagen
        </span>
      </div>
    </footer>
  );
};
