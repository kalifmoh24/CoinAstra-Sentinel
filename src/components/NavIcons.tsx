"use client";

import type { LucideIcon } from "lucide-react";
import {
  Home,
  Wallet,
  Coins,
  FileCode2,
  ArrowLeftRight,
  ShieldCheck,
  Radar,
  Bot,
  Sparkles,
  ShieldAlert,
  Bell,
  Star,
  CandlestickChart,
  Rocket,
  Brain,
  PieChart,
  Layers,
  TrendingUp,
  LineChart,
  Plug,
  Settings,
  BadgeDollarSign,
  FlaskConical,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Crown,
  ScanLine,
  Share2,
  Copy,
  ExternalLink,
  HelpCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import type { NavIconKey } from "@/lib/nav";

const MAP: Record<NavIconKey, LucideIcon> = {
  home: Home,
  wallet: Wallet,
  coins: Coins,
  fileCode: FileCode2,
  arrowLeftRight: ArrowLeftRight,
  shieldCheck: ShieldCheck,
  radar: Radar,
  bot: Bot,
  sparkles: Sparkles,
  shieldAlert: ShieldAlert,
  bell: Bell,
  star: Star,
  candlestick: CandlestickChart,
  rocket: Rocket,
  brain: Brain,
  pieChart: PieChart,
  layers: Layers,
  trendingUp: TrendingUp,
  lineChart: LineChart,
  plug: Plug,
  settings: Settings,
  badgeDollar: BadgeDollarSign,
  flaskConical: FlaskConical,
};

export function NavIcon({
  name,
  className = "h-4 w-4",
}: {
  name: NavIconKey;
  className?: string;
}) {
  const Icon = MAP[name] ?? Home;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}

export {
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Crown,
  ScanLine,
  Share2,
  Copy,
  ExternalLink,
  HelpCircle,
  ArrowLeft,
  AlertTriangle,
  Bell,
  Home,
  Wallet,
  Coins,
  FileCode2,
  ArrowLeftRight,
  Sparkles,
};
