'use client';

import {getDatabase, ref, set} from "@firebase/database";
import React, {useEffect, useState} from "react";
import {Pregame} from "./pregame"
import {Auto} from "./auto"
import {
	Alliance,
	AmpPlayed,
	AppState,
	AutoNoteCollected,
	Climb, DefenseRange,
	MicrophoneShot,
	NoteShot,
	Park,
	PickupLocation, Team
} from "@/components/data";
import {Button} from "@nextui-org/button";
import {Teleop} from "@/app/teleop";
import {PostGame} from "@/app/postgame";

export default function Home() {
	const [state, setState] = useState(AppState.PreMatch);

	const [alliance, setAlliance] = useState(Alliance.Blue);

	// Pre Match
	const [teamNumber, setTeamNumber] = useState("");
	const [matchNumber, setMatchNumber] = useState("");
	const [humanPlayerAmp, setHumanPlayerAmp] = useState(false);

	// Auto
	const [autoNotesAttempted, setAutoNotesAttempted] = useState<NoteShot[]>([]);
	const [autoNotesCollected, setAutoNotesCollected] = useState<AutoNoteCollected[]>([]);
	const [autoPark, setAutoPark] = useState(false);

	// Teleop
	const [notesAttempted, setNotesAttempted] = useState<NoteShot[]>([]);
	const [park, setPark] = useState<Park>({succeed: false, away: false});
	const [ampPlayed, setAmpPlayed] = useState<AmpPlayed | null>(null);
	const [microphone, setMicrophone] = useState<MicrophoneShot | null>(null);
	const [climb, setClimb] = useState<Climb | false>(false);
	const [trap, setTrap] = useState(false);
	const [amplify, setAmplify] = useState(0);

	// Post Match
	const [defense, setDefense] = useState(false);
	const [pickupLocation, setPickupLocation] = useState(PickupLocation.None);
	const [defenseScale, setDefenseScale] = useState<DefenseRange | null>(null);
	const [comments, setComments] = useState("");

	// Auto

	const updateAutoNotesAttempted = (thisAutoNotesAttempted: NoteShot) => {
		setAutoNotesAttempted(prevState => [...prevState, thisAutoNotesAttempted]);
	}

	const updateAutoNotesCollected = (thisAutoNotesCollected: AutoNoteCollected) => {
		setAutoNotesCollected(prevState => [...prevState, thisAutoNotesCollected]);
	}

	const updateAutoPark = (thisAutoPark: boolean) => {
		setAutoPark(thisAutoPark)
	}

	// Teleop

	const updateNotesAttempted = (thisNotesAttempted: NoteShot) => {
		setNotesAttempted(prevState => [...prevState, thisNotesAttempted]);
	}

	const updatePark = (thisPark: Park) => {
		setPark(thisPark);
	}

	const updateAmpPlayed = (thisAmpPlayed: AmpPlayed) => {
		setAmpPlayed(thisAmpPlayed);
	}

	const updateMicrophone = (thisMicrophone: MicrophoneShot) => {
		setMicrophone(thisMicrophone);
	}

	const updateClimb = (thisClimb: Climb) => {
		setClimb(thisClimb);
	}

	const updateTrap = (thisTrap: boolean) => {
		setTrap(thisTrap);
	}

	const updateAmplify = () => {
		setAmplify(prevState => prevState + 1);
	}

	// Post Match

	const updateDefense = (thisDefense: boolean) => {
		setDefense(thisDefense);
	}

	const updatePickupLocation = (thisPickupLocation: PickupLocation) => {
		setPickupLocation(thisPickupLocation);
	}

	const updateComments = (thisComments: string) => {
		setComments(thisComments);
	}

	const updateDefenseScale = (thisDefenseScale: DefenseRange) => {
		setDefenseScale(thisDefenseScale);
	}

	function upload() {
		const db = getDatabase();

		set(ref(db, 'matches/' + matchNumber + '/' + teamNumber), {
			ampPlayed: ampPlayed,
			amplify: amplify,
			autoNotesAttempted: autoNotesAttempted,
			autoNotesCollected: autoNotesCollected,
			autoPark: autoPark,
			climb: climb,
			comments: comments,
			defense: defense,
			defenseScale: defenseScale,
			humanPlayerAmp: humanPlayerAmp,
			microphone: microphone,
			number: teamNumber,
			park: park,
			pickupLocation: pickupLocation,
			teleopShots: notesAttempted,
			trap: trap
		});
	}

	function download() {
		// todo impl
	}

	function clear() {
		setAutoPark(false);
		setAutoNotesCollected([]);
		setAutoNotesAttempted([]);
		setHumanPlayerAmp(false);
		setMatchNumber("");
		setTeamNumber("");
		setNotesAttempted([]);
		setPark({succeed: false, away: false});
		setAmpPlayed(null);
		setMicrophone(null);
		setClimb(false);
		setTrap(false);
		setAmplify(0);
		setDefense(false);
		setDefenseScale(0);
		setComments("");
		setPickupLocation(PickupLocation.None);
	}

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
					<div className="flex gap-4">
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.PreMatch)}>Back</Button>
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.Teleop)}>Teleop</Button>
					</div>
					<Auto alliance={alliance} updateAutoNotesCollected={updateAutoNotesCollected}
						  updateAutoNotesAttempted={updateAutoNotesAttempted} updateAutoPark={updateAutoPark} />
				</section>
			)

		case AppState.Teleop:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<div className="flex gap-4">
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.Auto)}>Back</Button>
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.PostMatch)}>Post Match</Button>
					</div>
					<Teleop alliance={alliance} updateNotesAttempted={updateNotesAttempted} updatePark={updatePark}
							humanPlayerAmp={humanPlayerAmp} updateAmpPlayed={updateAmpPlayed} updateMicrophone={updateMicrophone}
							updateClimb={updateClimb} updateTrap={updateTrap} updateAmplify={updateAmplify} />
				</section>
			)

		case AppState.PostMatch:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
					<Button color="danger" variant="bordered" onPress={() => {
						setState(AppState.PreMatch);
						download();
						upload();
						clear();
					}}>Next Match</Button>
					<PostGame updateDefense={updateDefense} updatePickupLocation={updatePickupLocation} updateDefenseScale={updateDefenseScale}
							  updateComments={updateComments} />
				</section>
			)
	}
}