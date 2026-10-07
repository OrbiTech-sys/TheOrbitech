/**
 * Line drawing of the same gyroscope. Shown first, and kept when 3D is unavailable.
 * `hidden` keeps it painted for the crossfade but removes it from the accessibility tree.
 */
export default function GyroscopeDrawing({ className, hidden = false }: { className?: string; hidden?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="64 135 272 340"
      role={hidden ? undefined : "img"}
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Technical drawing of a steel and brass gyroscope balanced on a turned pedestal and slate plinth"}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {/* Centre line */}
        <path d="M200 150 V470" strokeDasharray="10 4 2 4" strokeWidth="0.75" opacity="0.6" />

        {/* Plinth */}
        <ellipse cx="200" cy="412" rx="105" ry="20" />
        <path d="M95 412 V436 A105 20 0 0 0 305 436 V412" />

        {/* Pedestal */}
        <ellipse cx="200" cy="404" rx="33" ry="6.5" />
        <path d="M186 398 C192 392 194 386 194 376 L195 352" />
        <path d="M214 398 C208 392 206 386 206 376 L205 352" />
        <path d="M195 352 C190 349 189 344 192 341 M205 352 C210 349 211 344 208 341" />
        <ellipse cx="200" cy="341" rx="11" ry="2.6" />

        {/* Gyroscope, leaning on its foot */}
        <g transform="rotate(17 200 340)">
          <path d="M200 340 L197.5 330 M200 340 L202.5 330" />
          <path d="M200 330 V212" />
          <circle cx="200" cy="208" r="3.6" />
          {/* Meridian ring */}
          <ellipse cx="200" cy="268" rx="30" ry="51" />
          <ellipse cx="200" cy="268" rx="26.5" ry="48" opacity="0.55" />
          {/* Equator ring */}
          <ellipse cx="200" cy="268" rx="51" ry="10.5" />
          <ellipse cx="200" cy="270.5" rx="51" ry="10.5" opacity="0.55" />
          {/* Rotor */}
          <ellipse cx="200" cy="264" rx="41" ry="8.2" />
          <path d="M159 264 V272 A41 8.2 0 0 0 241 272 V264" />
          <ellipse cx="200" cy="263" rx="7" ry="1.6" />
        </g>
      </g>

      {/* Ground line */}
      <path d="M40 457 H360" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}
