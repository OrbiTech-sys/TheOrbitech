import LogoMark from "@/components/ui/LogoMark";

/**
 * The logo as it is set in the header and footer: the mark, then the name in three weights.
 * The name is split from the site's own brand string ("The OrbiTech Solutions"), so it can never drift
 * from the name used in titles and structured data. A name in another shape is shown as plain text.
 */
export default function BrandLockup({ name }: { name: string }) {
  const [the, main, ...rest] = name.split(" ");
  const shaped = the?.toLowerCase() === "the" && main && rest.length > 0;
  return (
    <>
      <LogoMark />
      {shaped ? (
        <span className="brand__text">
          <span className="brand__the">{the}</span>
          <span className="brand__line">
            <span className="brand__name">{main}</span>
            <span className="brand__rest">{rest.join(" ")}</span>
          </span>
        </span>
      ) : (
        <span className="brand__line">
          <span className="brand__name">{name}</span>
        </span>
      )}
    </>
  );
}
