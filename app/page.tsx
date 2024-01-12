'use client';

import {title} from "@/components/primitives";
import {Button} from "@nextui-org/button";
import {getDatabase, set, ref} from "@firebase/database";

export default function Home() {

	function upload() {
		const db = getDatabase();

		set(ref(db, 'matches/0'), {
			teams: [2502, 2502, 2502, 2502, 2502, 2502]
		});
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div>
				<h1 className={title()}>Home</h1>
			</div>

			<Button variant="bordered" color="primary" onPress={() => {upload()}}>
				Upload Data
			</Button>
		</section>
	);
}
