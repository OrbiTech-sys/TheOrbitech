import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoGate from "@/components/DemoGate";
import PageIntro from "@/components/PageIntro";
import { site } from "@/content/site";
import { allDemos, demoOpenHref, findDemo } from "@/lib/demos";
import { projectHref } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// Pages for every known id are built ahead of time. They may block on a client navigation.
export const instant = false;

export function generateStaticParams() {
  return allDemos().map(({ demo }) => ({ id: demo.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = findDemo(id);
  if (!entry) return { title: "Demo not found", robots: { index: false } };
  return pageMetadata({
    title: `Open the ${entry.demo.name} demo | ${site.name}`,
    description: `Confirm your email with a 6-digit code to open the ${entry.demo.name} demo.`,
    path: `/demo/${id}`,
    noindex: true,
  });
}

export default async function DemoGatePage({ params }: Props) {
  const { id } = await params;
  const entry = findDemo(id);
  if (!entry) notFound();

  return (
    <>
      <PageIntro
        title={entry.demo.name}
        lede={
          <>
            Part of{" "}
            <Link href={projectHref(entry.project)} className="gate__anchor">
              {entry.project.shortName ?? entry.project.name}
            </Link>
            . Confirm your email and the live demo opens.
          </>
        }
      />
      <section className="wrap case-section" aria-label="Confirm your email">
        <DemoGate demo={entry.demo} openHref={demoOpenHref(id)} />
      </section>
    </>
  );
}
