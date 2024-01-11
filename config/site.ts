export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Scouting",
	description: "A scouting app developed by 2502 Talon Robotics.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Data",
      href: "/data",
    },
	],
};
