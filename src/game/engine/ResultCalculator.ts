import { RoleData, ScenarioPlayRecord } from '../store/types';

/* ============================================================================
 * DOKUMENTASI — ALGORITMA KALKULATOR HASIL (Result Calculator)
 * ============================================================================
 *
 * Fungsi ini menghitung "best match" profesi pemain di akhir sesi permainan.
 * Dipanggil sekali di `finishGame` (src/game/store/gameStore.ts) saat timer
 * habis atau semua situasi selesai dimainkan, lalu hasilnya dipakai oleh:
 *   - ResultScreen  : kartu "Jouw beste match (X% overeenkomst)"
 *   - MijnPadModal  : preview "Jouw Beste Match Tot Nu Toe"
 *   - analytics     : logGameCompletion(mode, matchedRole.id, score)
 *
 * ── INPUT (3 data sesi) ─────────────────────────────────────────────────────
 *   roles                 : daftar 16 profesi (fetch Supabase / JSON fallback)
 *   roleSelectionCounts   : Map roleId -> jumlah DIPILIH (benar + salah),
 *                           di-update di `answerScenario` (gameStore.ts)
 *   playHistory           : riwayat tiap jawaban:
 *                           { scenarioId, selectedRoleId, isCorrect }
 *
 * ── LANGKAH 1: Fallback tanpa data ──────────────────────────────────────────
 *   Jika `roles` kosong (fetch gagal total) -> kembalikan role hardcoded
 *   "receptionist" dengan 92%.
 *
 * ── LANGKAH 2: Hitung jawaban BENAR per role ────────────────────────────────
 *   Loop playHistory, HANYA yang isCorrect:true yang dihitung, dikelompokkan
 *   per selectedRoleId:
 *       correctPerRole = { kok: 3, receptionist: 2, ... }
 *   Kunci desain: jawaban salah TIDAK dihitung sebagai kecocokan, sehingga
 *   role yang sering dipilih tapi salah tidak bisa jadi "best match".
 *
 * ── LANGKAH 3: Pilih top match (prioritas bertingkat) ──────────────────────
 *   Iterasi semua role, pilih yang memenuhi:
 *     1. correct terbanyak            (kriteria utama)
 *     2. jika seri  -> total pilihan lebih banyak  (engagement)
 *     3. jika seri  -> role paling awal di daftar
 *   Kondisi lexicographic ada pada baris perbandingan `correct > bestCorrect
 *   || (correct === bestCorrect && total > bestTotal)`.
 *
 *   Edge case:
 *     - Tidak ada satu pun jawaban benar (semua salah) -> semua correct = 0,
 *       otomatis role yang paling sering dipilih yang menang.
 *     - Tidak ada pilihan sama sekali -> roles[0].
 *
 * ── LANGKAH 4: Match percentage ─────────────────────────────────────────────
 *       pct = 82 + (roleCorrect / totalPlayed) * 16
 *     - roleCorrect = berapa kali role terpilih dijawab benar
 *     - totalPlayed = jumlah situasi dimainkan (min 1, pakai `|| 1`)
 *     - Range otomatis 82%–98% -> sengaja tidak pernah di bawah 82% agar anak
 *       selalu mendapat hasil yang positif ("menyantinkan", keputusan desain
 *       yang terdokumentasi di master-plan/INTERVIEW_SUMMARY.md).
 *     - Persentase dihitung PER-ROLE, jadi angka "X% overeenkomst" benar-benar
 *       menggambarkan kesesuaian dengan role yang ditampilkan.
 *
 * ── CONTOH NYATA ────────────────────────────────────────────────────────────
 *   - Benar 4x untuk Receptie, salah 5x untuk Kok
 *       -> top match Receptie, pct = 82 + (4/9 * 16) = 89%
 *   - Sempurna 16/16 untuk satu role -> 98%
 *   - Semua salah -> role terpopuler dengan 82%
 * ========================================================================== */

/**
 * Calculates the player's top matched role from session data.
 *
 * Rules:
 * - Primary metric: number of CORRECT answers per role (a role only counts
 *   as a match when the player actually answered the scenario correctly).
 * - Tie-break: total selections (engagement), then role order in the list.
 * - If the player answered nothing correctly, fall back to the most-selected
 *   role (engagement), then to the first role in the list.
 * - Match percentage is per-role: based on how many of the played scenarios
 *   the matched role was answered correctly, mapped into an encouraging
 *   band of 82%–98% (design decision, see INTERVIEW_SUMMARY.md).
 */
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

  // Count correct answers per role
  const correctPerRole: Record<string, number> = {};
  for (const p of playHistory) {
    if (p.isCorrect) {
      correctPerRole[p.selectedRoleId] = (correctPerRole[p.selectedRoleId] ?? 0) + 1;
    }
  }

  // Pick role: most correct answers first, then most total selections
  let matchedRole = roles[0];
  let bestCorrect = -1;
  let bestTotal = -1;

  for (const role of roles) {
    const correct = correctPerRole[role.id] ?? 0;
    const total = roleSelectionCounts[role.id] ?? 0;
    if (correct > bestCorrect || (correct === bestCorrect && total > bestTotal)) {
      bestCorrect = correct;
      bestTotal = total;
      matchedRole = role;
    }
  }

  // Match percentage: how strongly the matched role fits, based on the
  // correct answers it received relative to everything played.
  const totalPlayed = playHistory.length || 1;
  const roleCorrect = correctPerRole[matchedRole.id] ?? 0;
  const matchScorePercentage = Math.round(82 + (roleCorrect / totalPlayed) * 16);

  return { matchedRole, matchScorePercentage };
}
