import { cookies } from "next/headers";
import { ACCESS_COOKIE, checkAccess } from "@/lib/demo-access";
import { demoTarget } from "@/lib/demo-targets";
import { findDemo } from "@/lib/demos";

/**
 * The only place a demo's real address is used. A visitor who has confirmed an
 * email in the last 24 hours is sent on to the demo. Everyone else is sent to the
 * confirmation page for that demo.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const target = findDemo(id) ? demoTarget(id) : null;
  if (!target) return new Response("Not found", { status: 404 });

  const jar = await cookies();
  const confirmed = checkAccess(jar.get(ACCESS_COOKIE)?.value);
  const destination = confirmed ? target : new URL(`/demo/${id}`, request.url).toString();

  return new Response(null, {
    status: 302,
    headers: { Location: destination, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
