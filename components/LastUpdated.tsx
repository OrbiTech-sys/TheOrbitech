import { formatDate } from "@/lib/pages";

/** The real date of the last content change, matching dateModified in structured data. */
export default function LastUpdated({ date }: { date: string }) {
  return (
    <p className="page-meta">
      Last updated <time dateTime={date}>{formatDate(date)}</time>
    </p>
  );
}
