'use client';

import {getDatabase, ref, set} from "@firebase/database";
import {useEffect, useState} from "react";
import {Pregame} from "./pregame"
import {Auto} from "./auto"
import {
	Alliance,
	AmpPlayed,
	AppState,
	AutoNote,
	AutoNoteCollected,
	Climb,
	DefenseRange,
	MicrophoneShot,
	NoteShot,
	PickupLocation,
	ScoreLocation,
	Team
} from "@/components/data";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Button} from "@nextui-org/button";

export default function Home() {
	const [team, setTeam] = useState<Team | undefined>(undefined);

	const [state, setState] = useState(AppState.PreMatch)

	const [teamNumber, setTeamNumber] = useState("");
	const [matchNumber, setMatchNumber] = useState("");
	const [humanPlayerAmp, setHumanPlayerAmp] = useState(false);
	const [autoNotesAttempted, setAutoNotesAttempted] = useState<NoteShot[] | undefined>(undefined);
	const [autoNotesCollected, setAutoNotesCollected] = useState<AutoNoteCollected[] | undefined>(undefined);
	const [autoPark, setAutoPark] = useState(false);

	const updateAutoNotesAttempted = (thisAutoNotesAttempted: NoteShot[]) => {
		setAutoNotesAttempted(thisAutoNotesAttempted)
	}

	const updateAutoNotesCollected = (thisAutoNotesCollected: AutoNoteCollected[]) => {
		setAutoNotesCollected(thisAutoNotesCollected)
	}

	const updateAutoPark = (thisAutoPark: boolean) => {
		setAutoPark(thisAutoPark)
	}

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

	function download() {
		// todo impl
	}

	let _team: Team = {
		ampPlayed: AmpPlayed.Reject,
		amplify: 2,
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

	switch (state) {
		case AppState.PreMatch:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<Button color="danger" variant="bordered" onPress={() => setState(AppState.Auto)}>Auto</Button>
					<Pregame matchNumber={matchNumber} setMatchNumber={setMatchNumber} teamNumber={teamNumber} setTeamNumber={setTeamNumber}
							 humanPlayerAmp={humanPlayerAmp} setHumanPlayerAmp={setHumanPlayerAmp} />
				</section>
			)

		case AppState.Auto:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<Button color="danger" variant="bordered" onPress={() => setState(AppState.Teleop)}>Teleop</Button>
					<Auto alliance={Alliance.Blue} updateAutoNotesCollected={updateAutoNotesCollected}
						  updateAutoNotesAttempted={updateAutoNotesAttempted} updateAutoPark={updateAutoPark} />
				</section>
			)

		case AppState.Teleop:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<Button color="danger" variant="bordered" onPress={() => setState(AppState.PostMatch)}>Post Match</Button>
				</section>
			)

		case AppState.PostMatch:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<Button color="danger" variant="bordered" onPress={() => {
						setState(AppState.PreMatch);
						download();
						upload();
					}}>Next Match</Button>
				</section>
			)
	}
}