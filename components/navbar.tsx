'use client';

import {link as linkStyles} from "@nextui-org/theme";

import {siteConfig} from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button";
import React, {useContext, useState} from "react";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar as NextUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle
} from "@nextui-org/react";
import {Link} from "@nextui-org/link";

export const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

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
				{siteConfig.navItems.map((item, index) => (
					<NavbarItem key={`${item}-${index}`}>
						<Link
							color="foreground"
							className="w-full"
							href={item.href}
							size="lg"
						>
							{item.label}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
		</NextUINavbar>
	);
};
