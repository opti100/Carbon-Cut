import { LayoutDashboard, Link2, User } from "lucide-react";

export const SidebarItems = [
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: LayoutDashboard,
  },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: Link2,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];


export const LOCAL_STORAGE_KEY = "googleAdsCustomerId";