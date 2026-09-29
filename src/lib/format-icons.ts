import { Clapperboard, ListVideo, Megaphone, MonitorPlay, Share2, Smartphone, type LucideIcon } from "lucide-react";
import type { FormatId } from "@/data/formats";

export const formatIcons: Record<FormatId, LucideIcon> = {
  integration: MonitorPlay,
  dedicated: Clapperboard,
  series: ListVideo,
  short: Smartphone,
  community: Megaphone,
  crosspost: Share2,
};
