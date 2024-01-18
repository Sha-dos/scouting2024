'use client';

import {title} from "@/components/primitives";
import {Button} from "@nextui-org/button";
import {getDatabase, ref, set} from "@firebase/database";
import {useEffect, useState} from "react";
import {
	AmpPlayed,
	AutoNote,
	Climb,
	DefenseRange,
	MicrophoneShot,
	PickupLocation,
	ScoreLocation,
	Team
} from "@/components/data";

export default function Home() {
	const [match, setMatch] = useState<number | undefined>(undefined);
	const [team, setTeam] = useState<Team | undefined>(undefined);

	function upload() {
		const db = getDatabase();

		set(ref(db, 'matches/' + 0 + '/' + team?.number), {
			number: team?.number,
			autoPark: team?.autoPark,
			humanPlayerAmp: team?.humanPlayerAmp,
			autoNoteOffCenter: team?.autoNotesCollected,
			autoNotesAttempted: team?.autoNotesAttempted,
			pickupLocation: team?.pickupLocation,
			ampPlayed: team?.ampPlayed,
			defense: team?.defense,
			defenseScale: team?.defenseScale,
			trap: team?.trap,
			climb: team?.climb,
			microphone: team?.microphone,
			park: team?.park,
			comments: team?.comments
		});
	}

	let _team: Team = {
		ampPlayed: AmpPlayed.Amplify,
		autoNotesCollected: [
			{
				time: 3.67,
				location: AutoNote.Mid3
			}
		],
		autoNotesAttempted: [
			{
				time: 8.82,
				made: false,
				locationShot: {
					x: 14,
					y: 14,
					distance: 5,
					angle: 22
				},
				locationScored: ScoreLocation.Speaker
			}
		],
		autoPark: false,
		climb: Climb.Solo,
		comments: "mid ong",
		defense: false,
		defenseScale: DefenseRange.NoDefense,
		humanPlayerAmp: true,
		microphone: MicrophoneShot.Failed,
		number: "0000",
		park: {
			succeed: true,
			away: true
		},
		pickupLocation: PickupLocation.Floor,
		trap: false

	};

	useEffect(() => {
		setTeam(_team)
	}, []);

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
