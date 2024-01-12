"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import {initializeApp} from "@firebase/app";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

	const firebaseConfig = {
		apiKey: "AIzaSyDuDKBerihVko_8_c9uFvnAkhKYMyDPPV0",
		authDomain: "scouting2024-bd9f1.firebaseapp.com",
		databaseURL: "https://scouting2024-bd9f1-default-rtdb.firebaseio.com",
		projectId: "scouting2024-bd9f1",
		storageBucket: "scouting2024-bd9f1.appspot.com",
		messagingSenderId: "1072635708570",
		appId: "1:1072635708570:web:1a8dc5b2af865268e24b23",
		measurementId: "G-XN5MS3V5MJ"
	};

	const app = initializeApp(firebaseConfig);

	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
		</NextUIProvider>
	);
}
