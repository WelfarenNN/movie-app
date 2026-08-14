import * as React from "react"
export const DarkMode = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#fff"
        d="M2 11C2 5.477 6.477 1 12 1h16c5.523 0 10 4.477 10 10v16c0 5.523-4.477 10-10 10H12C6.477 37 2 32.523 2 27V11Z"
        shapeRendering="crispEdges"
      />
      <path
        stroke="#E4E4E7"
        d="M12 1.5h16a9.5 9.5 0 0 1 9.5 9.5v16a9.5 9.5 0 0 1-9.5 9.5H12A9.5 9.5 0 0 1 2.5 27V11A9.5 9.5 0 0 1 12 1.5Z"
        shapeRendering="crispEdges"
      />
      <path
        stroke="#18181B"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13a4.243 4.243 0 0 0 6 6 6 6 0 1 1-6-6Z"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={40}
        height={40}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_153_7290"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_153_7290"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
)
