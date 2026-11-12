import { useId } from "react";

export function Drone({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      viewBox="0 0 700 470"
      role="img"
      aria-label="Concept illustration of a quadcopter with an onboard roadway inspection camera"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4a5667" />
          <stop offset=".42" stopColor="#202a38" />
          <stop offset="1" stopColor="#080e18" />
        </linearGradient>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6b7786" />
          <stop offset=".4" stopColor="#293441" />
          <stop offset="1" stopColor="#101925" />
        </linearGradient>
        <radialGradient id={`${id}-lens`}>
          <stop stopColor="#38bdf8" />
          <stop offset=".25" stopColor="#084b6c" />
          <stop offset=".65" stopColor="#111e2a" />
          <stop offset="1" stopColor="#060b12" />
        </radialGradient>
        <filter
          id={`${id}-shadow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="26"
            stdDeviation="20"
            floodColor="#000"
            floodOpacity=".55"
          />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`} transform="translate(15,-12)">
        <g stroke={`url(#${id}-arm)`} strokeWidth="25" strokeLinecap="round">
          <path d="M308 232 170 146M384 233 536 157M307 266 153 333M385 269 536 342" />
        </g>
        <g fill="#0b1420" stroke="#5b6878" strokeWidth="1.5">
          <ellipse cx="167" cy="151" rx="25" ry="15" />
          <path d="M143 144v-22h48v22" />
          <ellipse cx="167" cy="121" rx="25" ry="15" fill={`url(#${id}-arm)`} />
          <ellipse cx="537" cy="162" rx="25" ry="15" />
          <path d="M513 156v-22h48v22" />
          <ellipse cx="537" cy="133" rx="25" ry="15" fill={`url(#${id}-arm)`} />
          <ellipse cx="151" cy="338" rx="25" ry="15" />
          <path d="M127 332v-22h48v22" />
          <ellipse cx="151" cy="309" rx="25" ry="15" fill={`url(#${id}-arm)`} />
          <ellipse cx="537" cy="347" rx="25" ry="15" />
          <path d="M513 341v-22h48v22" />
          <ellipse cx="537" cy="318" rx="25" ry="15" fill={`url(#${id}-arm)`} />
        </g>
        <g fill="#a1adba" fillOpacity=".2" stroke="#a6b2c1" strokeOpacity=".44">
          <path d="M167 119C120 68 69 79 66 90l88 35c49 51 96 50 108 37z" />
          <path d="M537 131c-6-55-63-68-73-61l62 62c7 59 65 75 76 64z" />
          <path d="M151 307c-49-44-99-29-101-18l88 25c48 46 99 33 108 23z" />
          <path d="M537 316c-5-53-64-69-74-61l63 63c9 54 64 76 75 64z" />
        </g>
        <g fill="none" stroke="#9bafc4" strokeOpacity=".1">
          <ellipse cx="167" cy="121" rx="104" ry="52" />
          <ellipse cx="537" cy="133" rx="104" ry="52" />
          <ellipse cx="151" cy="309" rx="104" ry="52" />
          <ellipse cx="537" cy="318" rx="104" ry="52" />
        </g>
        <path
          d="m284 203 61-31 63 33 7 68-68 47-69-44z"
          fill={`url(#${id}-body)`}
          stroke="#617082"
          strokeWidth="1"
        />
        <path
          d="m285 202 61 32 62-29M346 234v64"
          fill="none"
          stroke="#718094"
          strokeOpacity=".5"
        />
        <path d="m307 202 39-19 40 21-40 20z" fill="#1b2634" stroke="#6f7f92" />
        <path d="m317 202 29-13 28 14-28 14z" fill="#111c2a" />
        <path d="m324 201 22-9 20 11-20 9z" fill="#39bdf8" fillOpacity=".4" />
        <g stroke="#6c7a8b" strokeWidth="1.4">
          <path d="m294 217 29 15m-30-7 29 15m-29-6 29 15m47-17 28-15m-28 23 28-15m-28 23 28-15" />
        </g>
        <path
          d="m304 288-6 56 30 13m55-69 7 56-27 13"
          fill="none"
          stroke="#647184"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path d="M346 293v32" stroke="#718096" strokeWidth="9" />
        <rect
          x="321"
          y="313"
          width="51"
          height="37"
          rx="9"
          fill="#172332"
          stroke="#6e8095"
        />
        <circle
          cx="347"
          cy="332"
          r="16"
          fill={`url(#${id}-lens)`}
          stroke="#667e94"
        />
        <circle cx="343" cy="327" r="4" fill="#a7edff" fillOpacity=".6" />
        <path d="m286 264 16 7m90 0 17-8" stroke="#34d399" strokeWidth="3" />
        <path d="M346 175v-31" stroke="#5d6b7b" strokeWidth="3" />
        <circle cx="346" cy="142" r="4" fill="#6b7c8e" />
      </g>
    </svg>
  );
}

export function SurveyMap({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 700"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="survey-grid"
          width="44"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path d="M44 0H0v44" stroke="#294458" strokeWidth=".6" />
        </pattern>
        <linearGradient id="survey-road">
          <stop stopColor="#142637" />
          <stop offset="1" stopColor="#263e4c" />
        </linearGradient>
      </defs>
      <rect width="1000" height="700" fill="#0a1420" />
      <rect width="1000" height="700" fill="url(#survey-grid)" opacity=".5" />
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M${-220 + i * 45} 700C${50 + i * 22} 510 ${-60 + i * 43} 430 ${170 + i * 30} 320S${430 + i * 40} 200 ${480 + i * 40} -40`}
          stroke="#34505b"
          strokeOpacity=".22"
        />
      ))}
      <g
        transform="rotate(-28 550 350)"
        fill="#152631"
        stroke="#243c47"
        strokeWidth="1"
      >
        {Array.from({ length: 35 }, (_, i) => (
          <rect
            key={i}
            x={210 + (i % 7) * 92}
            y={105 + Math.floor(i / 7) * 96}
            width={62 + (i % 3) * 3}
            height={58 + (i % 4) * 3}
            rx="3"
          />
        ))}
        <path d="M100 375H920" stroke="#3a515e" strokeWidth="34" />
        <path d="M500 20V690" stroke="#304955" strokeWidth="24" />
        <path
          d="M100 375H920"
          stroke="#879590"
          strokeOpacity=".5"
          strokeDasharray="16 16"
        />
      </g>
      <path
        d="M20 630C210 560 210 475 435 424S720 315 1000 170"
        stroke="#08121d"
        strokeWidth="74"
      />
      <path
        d="M20 630C210 560 210 475 435 424S720 315 1000 170"
        stroke="url(#survey-road)"
        strokeWidth="60"
      />
      <path
        d="M20 630C210 560 210 475 435 424S720 315 1000 170"
        stroke="#758183"
        strokeWidth="1.2"
        strokeDasharray="16 16"
      />
      <path
        d="M190 551C300 462 430 457 526 413S722 332 868 249"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeDasharray="5 9"
      />
      <g stroke="#38bdf8">
        <circle cx="526" cy="413" r="7" fill="#0d2939" />
        <circle cx="526" cy="413" r="23" opacity=".4" />
        <path d="M493 393v-12h12m42 0h12v12m0 40v12h-12m-42 0h-12v-12" />
      </g>
      <g fill="#6c8a9b" fontFamily="monospace" fontSize="10">
        <text x="751" y="554">
          INSPECTION ROUTE / CONCEPT
        </text>
        <text x="535" y="480">
          WAYPOINT 03
        </text>
        <text x="784" y="110">
          N ↑
        </text>
      </g>
    </svg>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene">
      <SurveyMap className="hero-map" />
      <div className="scan-cone" />
      <Drone className="hero-drone" />
      <div className="scene-coordinate">
        40°44′ N &nbsp; 74°01′ W<span>CONCEPT VISUALIZATION</span>
      </div>
      <div className="scene-note">
        <span className="status-dot" />
        ONBOARD VISION
        <span className="note-line" />
      </div>
      <div className="scene-caption">
        <span>01 / AIR-TO-INSIGHT</span>
        <span>HUMAN-SUPERVISED. PURPOSE-BUILT.</span>
      </div>
    </div>
  );
}
