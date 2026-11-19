import {
  BriefcaseBusiness,
  Building2,
  Bot,
  CodeXml,
  Compass,
  Database,
  HeartPulse,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/offerings";

const icons: Record<IconName, LucideIcon> = {
  bot: Bot,
  code: CodeXml,
  workflow: Workflow,
  database: Database,
  compass: Compass,
  cart: ShoppingCart,
  building: Building2,
  bag: ShoppingBag,
  utensils: UtensilsCrossed,
  heart: HeartPulse,
  briefcase: BriefcaseBusiness,
};

/** One minimal line icon from a name in the content files, so content never imports components. */
export default function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Glyph = icons[name];
  return <Glyph size={size} strokeWidth={1.6} aria-hidden="true" focusable="false" />;
}
