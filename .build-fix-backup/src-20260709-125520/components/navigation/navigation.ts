import {
  LayoutDashboard,
  Briefcase,
  ArrowLeftRight,
  LineChart,
  Shield,
  Wallet,
  Search,
  Calendar,
  Settings,
  Brain,
  Eye,
  BookOpen
} from "lucide-react";

export const NAVIGATION = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Portfolio", href: "/portfolio", icon: Briefcase },
  { title: "Holdings", href: "/holdings", icon: Wallet },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", href: "/analytics", icon: LineChart },
  { title: "Risk", href: "/risk", icon: Shield },
  { title: "Research", href: "/research", icon: BookOpen },
  { title: "Reviews", href: "/reviews", icon: Calendar },
  { title: "Watchlists", href: "/watchlists", icon: Eye },
  { title: "Intelligence", href: "/intelligence", icon: Brain },
  { title: "Search", href: "/search", icon: Search },
  { title: "Settings", href: "/settings", icon: Settings }
];
