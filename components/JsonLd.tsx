import { siteNodes, type Node } from "@/lib/schema";

/**
 * One JSON-LD graph per page: the Organization and WebSite nodes plus the nodes
 * for this page. `<` is escaped so content can never close the script tag.
 */
export default function JsonLd({ nodes = [] }: { nodes?: Node[] }) {
  const graph = { "@context": "https://schema.org", "@graph": [...siteNodes(), ...nodes] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
