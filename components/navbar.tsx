import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button";

export const Navbar = () => {
	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Image
							radius="sm"
							width={35}
							alt="Talon Robotics"
							src="/TalonLogo.png"
						/>
						<p className="font-bold text-inherit">Talon Robotics</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>

				<NavbarContent as="div" justify="end">
					<Button variant="bordered" isIconOnly={true}>
						<Image
							src="/cog-outline.svg"
							width={35}
							height={35}
							alt="settings"
							className="accent-white"
							/>
					</Button>
				</NavbarContent>
			</NavbarContent>


		</NextUINavbar>
	);
};
