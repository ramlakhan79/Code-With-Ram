import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import getUniqueId from '../utils/uniqueid';

HeaderLogo.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
};

export default function HeaderLogo({ isDarkMode }) {
    const [stdDeviation, setStdDeviation] = useState(8);
    const [glowColor, setGlowColor] = useState(
        isDarkMode
            ? 'hsl(var(--color-primBlue-300))'
            : 'hsl(var(--color-suppBlue-300))'
    );

    const headerLogoId = getUniqueId('header-logo-');

    const inactiveColors = (isDark) => {
        setGlowColor(
            isDark
                ? 'hsl(var(--color-primBlue-300))'
                : 'hsl(var(--color-suppBlue-300))'
        );
    };

    const handleHoverEnter = () => {
        setStdDeviation(14);

        setGlowColor(
            isDarkMode
                ? 'hsl(var(--color-primBlue-100))'
                : 'hsl(var(--color-suppBlue-400))'
        );
    };

    const handleHoverExit = () => {
        setStdDeviation(8);
        inactiveColors(isDarkMode);
    };

    useEffect(() => {
        inactiveColors(isDarkMode);
    }, [isDarkMode]);

    return (
        <div>
                <svg width="40" height="40" viewBox="0 0 120 120" role="img" aria-label="Code With Ram logo">
                    <rect width="120" height="120" rx="28" fill="#0F172A" />
                    <polyline points="40,36 18,60 40,84" fill="none" stroke="#2DD4A7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="80,36 102,60 80,84" fill="none" stroke="#2DD4A7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M51 82 V38 H62 A11 11 0 0 1 62 60 H51 M60 60 L73 82" fill="none" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* <span>Code With <b>Ram</b></span> */}
            {/* <img className="w-[85px]" src="/assets/images/codewithram2.png" alt="Profile of Ramlakhan" /> */}
        </div>
        // <svg
        //     className="h-10 md:h-13 lg:h-[136px]"
        //     viewBox="0 0 100 100"
        //     xmlns="http://www.w3.org/2000/svg"
        //     role="img"
        //     aria-label="Code With Ram"
        //     onMouseEnter={handleHoverEnter}
        //     onMouseLeave={handleHoverExit}
        // >
        //     <title>Code With Ram</title>

        //     <defs>
        //         <filter
        //             id={headerLogoId}
        //             x="-50%"
        //             y="-50%"
        //             width="200%"
        //             height="200%"
        //             colorInterpolationFilters="sRGB"
        //         >
        //             <feGaussianBlur
        //                 stdDeviation={stdDeviation}
        //                 result="blur"
        //             />

        //             <feFlood
        //                 floodColor={glowColor}
        //                 floodOpacity="0.75"
        //                 result="glowColor"
        //             />

        //             <feComposite
        //                 in="glowColor"
        //                 in2="blur"
        //                 operator="in"
        //                 result="glow"
        //             />

        //             <feMerge>
        //                 <feMergeNode in="glow" />
        //                 <feMergeNode in="SourceGraphic" />
        //             </feMerge>
        //         </filter>

        //         <linearGradient
        //             id={`${headerLogoId}-gradient`}
        //             x1="15%"
        //             y1="10%"
        //             x2="85%"
        //             y2="90%"
        //         >
        //             <stop
        //                 offset="0%"
        //                 stopColor={
        //                     isDarkMode
        //                         ? 'hsl(var(--color-primBlue-200))'
        //                         : 'hsl(var(--color-suppBlue-500))'
        //                 }
        //             />

        //             <stop
        //                 offset="100%"
        //                 stopColor={
        //                     isDarkMode
        //                         ? 'hsl(var(--color-primBlue-500))'
        //                         : 'hsl(var(--color-suppBlue-700))'
        //                 }
        //             />
        //         </linearGradient>
        //     </defs>

        //     <g filter={`url(#${headerLogoId})`}>
        //         {/* Outer globe */}
        //         <circle
        //             cx="50"
        //             cy="50"
        //             r="43"
        //             fill="none"
        //             stroke={`url(#${headerLogoId}-gradient)`}
        //             strokeWidth="5"
        //         />

        //         {/* Globe longitude */}
        //         <ellipse
        //             cx="50"
        //             cy="50"
        //             rx="18"
        //             ry="43"
        //             fill="none"
        //             stroke={`url(#${headerLogoId}-gradient)`}
        //             strokeWidth="2.5"
        //             opacity="0.75"
        //         />

        //         {/* Globe latitude */}
        //         <ellipse
        //             cx="50"
        //             cy="50"
        //             rx="43"
        //             ry="17"
        //             fill="none"
        //             stroke={`url(#${headerLogoId}-gradient)`}
        //             strokeWidth="2.5"
        //             opacity="0.75"
        //         />

        //         {/* Code brackets */}
        //         <path
        //             d="M38 38 L27 50 L38 62"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="5"
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //         />

        //         <path
        //             d="M62 38 L73 50 L62 62"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="5"
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //         />

        //         {/* Code slash */}
        //         <path
        //             d="M55 35 L45 65"
        //             fill="none"
        //             stroke={`url(#${headerLogoId}-gradient)`}
        //             strokeWidth="5"
        //             strokeLinecap="round"
        //         />

        //         {/* R */}
        //         <path
        //             d="M46 43 V58"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="3"
        //             strokeLinecap="round"
        //         />

        //         <path
        //             d="M46 43 H52
        //                C57 43 57 50 52 50
        //                H46"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="3"
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //         />

        //         <path
        //             d="M51 50 L57 58"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="3"
        //             strokeLinecap="round"
        //         />
        //     </g>
        // </svg>
    );
}