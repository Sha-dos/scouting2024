'use client';

import React, {useState} from "react";
import {Pregame} from "./pregame"
import {Auto} from "./auto"
import {
	Alliance,
	AmpPlayed,
	AppState,
	AutoNoteCollected,
	Climb,
	Data,
	DefenseRange,
	MicrophoneShot,
	NoteShot,
	Park,
	PickupLocation,
	Station,
	Trap,
} from "@/components/data";
import {Button} from "@nextui-org/button";
import {Teleop} from "@/app/teleop";
import {PostGame} from "@/app/postgame";
import {getDatabase, ref, set} from "@firebase/database";
import {readData, writeData} from "../components/filesystem";

export default function Home() {
	const [state, setState] = useState(AppState.PreMatch);

	const [alliance, setAlliance] = useState(Alliance.Red);

	// Pre Match
	const [teamNumber, setTeamNumber] = useState("");
	const [matchNumber, setMatchNumber] = useState("");
	const [humanPlayerAmp, setHumanPlayerAmp] = useState(false);
	const [station, setStation] = useState<Station>(Station.Red1);

	// Auto
	const [autoNotesAttempted, setAutoNotesAttempted] = useState<NoteShot[]>([]);
	const [autoNotesCollected, setAutoNotesCollected] = useState<AutoNoteCollected[]>([]);
	const [autoPark, setAutoPark] = useState(false);

	// Teleop
	const [notesAttempted, setNotesAttempted] = useState<NoteShot[]>([]);
	const [park, setPark] = useState<Park>(Park.None);
	const [ampPlayed, setAmpPlayed] = useState<AmpPlayed | null>(null);
	const [microphone, setMicrophone] = useState<MicrophoneShot | null>(null);
	const [climb, setClimb] = useState<Climb | false>(false);
	const [trap, setTrap] = useState(Trap.None);
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

	const updateAutoNotesCollected = (thisNotesAttempted: NoteShot) => {
     	setAutoNotesAttempted(prevState => [...prevState, thisNotesAttempted])
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

	const updateTrap = (thisTrap: Trap) => {
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

	const updateAlliance = (sta: Station) => {
		setStation(sta);

		switch (sta) {
			case Station.Red1:
				setAlliance(Alliance.Red)
				break
			case Station.Red2:
				setAlliance(Alliance.Red)
				break
			case Station.Red3:
				setAlliance(Alliance.Red)
				break
			case Station.Blue1:
				setAlliance(Alliance.Blue)
				break
			case Station.Blue2:
				setAlliance(Alliance.Blue)
				break
			case Station.Blue3:
				setAlliance(Alliance.Blue)
				break
		}
	}

	function upload() {
		const db = getDatabase();

		set(ref(db, 'data/' + matchNumber + '/teams/' + teamNumber), {
			alliance: alliance,
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
			notesAttempted: notesAttempted,
			trap: trap
		});
	}

	function download() {
		let data = {
			matches: [{
				alliance: alliance,
				matchNumber: matchNumber,
				teamNumber: teamNumber,
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
				notesAttempted: notesAttempted,
				trap: trap
			}]}

		readData().then(value => {
			//console.log(value.length);
			if (value && value.length && value.length != 0) {
				console.log("parsing")
				let parsed: Data = JSON.parse(value);
				// @ts-ignore
				parsed.matches.push(data.matches[0]);
				writeData(JSON.stringify(parsed));
			} else {
				writeData(JSON.stringify(data));
			}
		});
	}

	function clear() {
		setAutoPark(false);
		setAutoNotesCollected([]);
		setAutoNotesAttempted([]);
		setHumanPlayerAmp(false);
		setMatchNumber("");
		setTeamNumber("");
		setNotesAttempted([]);
		setPark(Park.None);
		setAmpPlayed(null);
		setMicrophone(null);
		setClimb(false);
		setTrap(Trap.None);
		setAmplify(0);
		setDefense(false);
		setDefenseScale(null);
		setComments("");
		setPickupLocation(PickupLocation.None);
	}

	switch (state) {
		case AppState.PreMatch:
			return (
				<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10" >
					<Button color="danger" variant="bordered" onPress={() => setState(AppState.Auto)}>Auto</Button>
					<Pregame matchNumber={matchNumber} setMatchNumber={setMatchNumber} teamNumber={teamNumber} setTeamNumber={setTeamNumber}
							 humanPlayerAmp={humanPlayerAmp} setHumanPlayerAmp={setHumanPlayerAmp} updateAlliance={updateAlliance}
							 station={station} />
				</section>
			)

		case AppState.Auto:
			return (
				<section className="flex flex-col items-center justify-center gap-4">
					<div className="flex gap-4">
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.PreMatch)}>Back</Button>
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.Teleop)}>Teleop</Button>
					</div>
					<Auto alliance={alliance} updateAutoNotesCollected={updateAutoNotesCollected}
						  updateAutoNotesAttempted={updateAutoNotesAttempted} updateAutoPark={updateAutoPark}/>
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
					<div className="flex gap-4">
						<Button color="danger" variant="bordered" onPress={() => setState(AppState.Teleop)}>Back</Button>
						<Button color="danger" variant="bordered" onPress={() => {
							setState(AppState.PreMatch);
							download();
							upload();
							clear();
						}}>Next Match</Button>
					</div>
					<PostGame updateDefense={updateDefense} updatePickupLocation={updatePickupLocation} updateDefenseScale={updateDefenseScale}
							  updateComments={updateComments} />
				</section>
			)
	}
}
