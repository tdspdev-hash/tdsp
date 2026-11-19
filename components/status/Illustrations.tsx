/**
 * Vector illustrations rebuilt from the design mockups (404 landscape and the
 * "coming soon" construction scene). Drawn as inline SVG so they stay sharp,
 * weigh almost nothing and use the site's own font for the lettering.
 * They are decorative: the surrounding text carries the meaning.
 */

const DARK = "#0b4a24";
const MID = "#2f8a2f";
const LIGHT = "#8fcf4a";
const PALE = "#e4f1e6";
const GOLD = "#f6b800";

export function Illustration404({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 260"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* clouds and the soft backdrop */}
      <ellipse cx="62" cy="62" rx="34" ry="13" fill={PALE} />
      <ellipse cx="82" cy="52" rx="22" ry="14" fill={PALE} />
      <ellipse cx="452" cy="52" rx="32" ry="12" fill={PALE} />
      <ellipse cx="436" cy="44" rx="18" ry="12" fill={PALE} />
      <path
        d="M30 196c-4-38 22-70 60-72 12-30 56-46 86-26 20-22 62-20 80 4 26-22 76-18 94 12 34-8 70 14 72 44 2 28-8 44-30 52H70c-24 0-38-4-40-14z"
        fill={PALE}
      />

      {/* sun and rays */}
      <g stroke={GOLD} strokeWidth="9" strokeLinecap="round">
        <line x1="262" y1="26" x2="262" y2="48" />
        <line x1="222" y1="38" x2="234" y2="56" />
        <line x1="302" y1="38" x2="290" y2="56" />
        <line x1="196" y1="62" x2="212" y2="72" />
        <line x1="328" y1="62" x2="312" y2="72" />
      </g>

      {/* 404 */}
      <text
        x="260"
        y="148"
        textAnchor="middle"
        fontFamily="inherit"
        fontWeight="900"
        fontSize="148"
        letterSpacing="-4"
        fill={DARK}
      >
        404
      </text>

      {/* setting sun behind the hills */}
      <circle cx="262" cy="196" r="40" fill={GOLD} />

      {/* hills */}
      <path
        d="M20 244c8-30 56-52 112-44 40 6 70 24 118 20 46-4 78-30 128-30 64 0 112 26 122 54z"
        fill={MID}
      />
      <path
        d="M24 244c40-22 98-34 150-20 52 14 92 8 140-8 52-18 112-12 182 28z"
        fill={LIGHT}
      />
      <path
        d="M190 244c36-28 92-40 150-26 56 14 100 8 150 26z"
        fill={MID}
        opacity=".55"
      />

      {/* tractor */}
      <g fill={DARK}>
        <rect x="78" y="186" width="44" height="22" rx="4" />
        <rect x="98" y="172" width="20" height="18" rx="3" />
        <rect x="92" y="168" width="32" height="6" rx="2" />
        <circle cx="86" cy="212" r="11" />
        <circle cx="122" cy="212" r="7" />
        <rect x="46" y="200" width="22" height="10" rx="3" />
        <circle cx="52" cy="214" r="6" />
      </g>
      <g fill={PALE}>
        <circle cx="86" cy="212" r="4" />
        <circle cx="122" cy="212" r="2.6" />
      </g>

      {/* seedling, right */}
      <path d="M440 246V150" stroke={DARK} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M440 150C440 112 462 88 494 82c2 34-18 62-54 68z" fill={MID} />
      <path d="M440 150c8-28 26-48 46-62" stroke={DARK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 196c-4-26-24-40-48-40 0 24 20 40 48 40z" fill={LIGHT} />
    </svg>
  );
}

export function IllustrationConstruction({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 460 290"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* soft backdrop and clouds */}
      <ellipse cx="96" cy="46" rx="42" ry="14" fill={PALE} />
      <ellipse cx="124" cy="36" rx="26" ry="16" fill={PALE} />
      <ellipse cx="350" cy="34" rx="40" ry="14" fill={PALE} />
      <ellipse cx="330" cy="26" rx="22" ry="14" fill={PALE} />
      <ellipse cx="230" cy="150" rx="190" ry="120" fill={PALE} opacity=".7" />

      {/* leaves behind */}
      <path d="M92 250C60 214 52 160 86 118c40 36 48 96 6 132z" fill={MID} />
      <path d="M92 250C84 204 84 160 86 118" stroke={DARK} strokeWidth="3" fill="none" />
      <path d="M52 236C30 214 32 178 56 158c26 22 24 58-4 78z" fill={LIGHT} />
      <path d="M376 244C400 204 406 154 374 112c-38 30-48 90 2 132z" fill={MID} />
      <path d="M376 244c4-46 0-90-2-132" stroke={DARK} strokeWidth="3" fill="none" />
      <path d="M420 236c18-20 16-52-4-70-22 18-20 52 4 70z" fill={LIGHT} />

      {/* laptop */}
      <rect x="132" y="38" width="196" height="150" rx="12" fill={DARK} />
      <rect x="146" y="52" width="168" height="122" rx="4" fill="#fff" />
      <g transform="translate(230 92)" fill="none" stroke={MID} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 22V4" />
        <path d="M0 8C-12 8-20-2-18-14 -6-14 2-6 0 8z" fill={MID} />
        <path d="M0 4C10 4 18-4 16-14 6-14-2-6 0 4z" fill={MID} />
      </g>
      <text
        x="230"
        y="148"
        textAnchor="middle"
        fontFamily="inherit"
        fontWeight="900"
        fontSize="30"
        fill={DARK}
      >
        TDSP
      </text>
      <path d="M96 188h268l16 34c2 6-2 12-8 12H88c-6 0-10-6-8-12z" fill={DARK} />
      <path d="M96 188h268l8 18H88z" fill="#124d2c" />
      <rect x="196" y="198" width="68" height="6" rx="3" fill="#2a6a43" />

      {/* hard hat */}
      <path d="M92 236c-6-40 14-66 48-66s54 26 48 66z" fill={GOLD} />
      <path d="M118 168c-4 18-6 42-4 68" stroke="#e0a000" strokeWidth="4" fill="none" />
      <path d="M144 164c0 24 2 48 4 72" stroke="#e0a000" strokeWidth="4" fill="none" />
      <rect x="80" y="232" width="128" height="14" rx="7" fill="#f2a900" />

      {/* barrier */}
      <rect x="252" y="196" width="104" height="30" rx="4" fill="#fff" />
      <g fill="#f08a00">
        <path d="M252 196h22l-16 30h-6z" />
        <path d="M290 196h22l-16 30h-22z" />
        <path d="M328 196h22l-12 30h-26z" />
      </g>
      <rect x="252" y="196" width="104" height="30" rx="4" fill="none" stroke="#f08a00" strokeWidth="3" />
      <path d="M264 226l-10 28M342 226l10 28" stroke="#f08a00" strokeWidth="7" strokeLinecap="round" />

      {/* cone */}
      <path d="M386 258l14-92c.6-4 6-4 6.6 0l14 92z" fill="#f47c00" />
      <path d="M392 222l22 0 3-22-28 0z" fill="#fff" />
      <path d="M396 188l14 0 2-14-18 0z" fill="#fff" />
      <rect x="374" y="254" width="52" height="14" rx="5" fill="#f47c00" />
    </svg>
  );
}

/** Green and yellow rolling-hills wave used at the foot of cards and pages. */
export function Wave({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 80"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 46C70 6 150 14 230 40s120 8 170-14v54H0z" fill={MID} />
      <path d="M0 62C80 30 170 40 250 52c60 9 110-2 150-22v50H0z" fill={GOLD} opacity=".0" />
      <path d="M180 44c80-8 150-36 220-40v22C340 30 270 52 180 44z" fill={GOLD} />
      <path d="M0 60C90 40 190 50 270 62c50 7 90 4 130-8v26H0z" fill={DARK} />
    </svg>
  );
}
