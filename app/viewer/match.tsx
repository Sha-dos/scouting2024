'use client';

import {
    Divider,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure
} from "@nextui-org/react";
import {Alliance, Data, ScoreLocation, TeamMatchData} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ModalFooter} from "@nextui-org/modal";
import {ShootPoint} from "@/components/shot";
import {useEffect, useRef, useState} from "react";

const DOWNSCALE = 0.77777777778;

export const MatchListView = ({matchData, updateSelectedMatch, updateSelectedTeam}: {matchData: Data | undefined, updateSelectedMatch: (arg0: number | null) => void, updateSelectedTeam: (arg0: number | null) => void}) => {
    return (
        <div className="flex flex-col min-w-[100%]">
            <div className="flex min-w-[85%]">
                <div className="flex gap-4 justify-start">
                    <a className="w-16">Match</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Teams</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Auto Notes</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Auto Made</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Auto Missed</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Teleop made</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Teleop Missed</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">HP Amp</a>
                    <Divider orientation="vertical"/>

                    <a className="w-16">Climb</a>
                    <Divider orientation="vertical"/>
                </div>
            </div>

            {matchData?.matches.map(match => {

                match.teams.sort((a, b) => {
                    if (a.alliance === Alliance.Red && b.alliance === Alliance.Blue) {
                        return -1;
                    } else if (a.alliance === Alliance.Blue && b.alliance === Alliance.Red) {
                        return 1;
                    }
                    return 0;
                });


                return (
                    <div key={match.matchNumber} className="min-w-[100%]">
                        <Divider/>
                        <MatchView key={match.matchNumber} matchNumber={match.matchNumber} teams={match.teams} updateSelectedMatch={updateSelectedMatch} updateSelectedTeam={updateSelectedTeam}/>
                    </div>
                )
            })}
        </div>
    )
}

const MatchView = ({matchNumber, teams, updateSelectedMatch, updateSelectedTeam}:
                       { matchNumber: number, teams: TeamMatchData[], updateSelectedMatch: (arg0: number | null) => void, updateSelectedTeam: (arg0: number | null) => void}) => {

    return (
        <div className="flex content-evenly min-w-full">
            <Button variant="light" onPress={() => updateSelectedMatch(matchNumber)}>{matchNumber}</Button>

            {/* Why not being shown? */}
            <Divider as="div" orientation="vertical"/>

            <div className="flex flex-col gap-4 min-w-full">
                {teams.map((team, idx) => (
                    <div className="flex min-w-[85%]" key={team.teamNumber}>
                        <Button onPress={() => updateSelectedTeam(team.teamNumber)} variant="light" key={idx} className="justify-start flex gap-4">{
                            <>
                                {/* Maybe move color back to the button */}
                                <a className={team.alliance == Alliance.Red ? "w-16 text-red-600" : "w-16 text-blue-600"}>{team.teamNumber}</a>
                                <Divider orientation="vertical"/>

                                <a className="w-16">{team.autoNotesCollected.length}</a>
                                <Divider orientation="vertical"/>

                                <a className="w-16 text-green-600">{team.autoNotesAttempted.filter(note => note.made).length}</a>
                                <Divider orientation="vertical"/>

                                <a className="w-16 text-red-600">{team.autoNotesAttempted.filter(note => !note.made).length}</a>
                                <Divider orientation="vertical"/>

                                <a className="w-16 text-green-600">{team.notesAttempted.filter(note => note.made).length}</a>
                                <Divider orientation="vertical"/>

                                <a className="w-16 text-red-600">{team.notesAttempted.filter(note => !note.made).length}</a>
                                <Divider orientation="vertical"/>

                                <div className="w-16 flex justify-center items-center">
                                    <Image width={20}
                                           src={team.humanPlayerAmp ? "/checkmark-outline.svg" : "/close-outline.svg"}/>
                                </div>
                                <Divider orientation="vertical"/>

                                <a className="w-16">{team.climb}</a>
                                <Divider orientation="vertical"/>

                                <a>{team.comments}</a>
                                <Divider orientation="vertical"/>
                            </>
                        }</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

enum Mode {
    Auto = "Auto",
    Teleop = "Teleop",
}

export const MatchDetailView = ({data, updateSelectedMatch}:
                                    {data: { matchNumber: number, teams: TeamMatchData[] } | undefined, updateSelectedMatch: (arg0: number | null) => void}) => {
    const [mode, setMode] = useState<Mode>(Mode.Auto);

    if (!data) { return(<></>); }

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //@ts-ignore
        setMode(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex">
                <Button variant="bordered" onPress={() => updateSelectedMatch(null)}>Back</Button>
            </div>

            <h1 className="content-center font-bold text-3xl">{data.matchNumber}</h1>

            <div className="flex justify-center">
                <Select
                    label="Mode"
                    variant="bordered"
                    placeholder="Select a mode"
                    selectedKeys={[mode]}
                    className="max-w-xs content-center justify-center"
                    onChange={handleSelectionChange}
                >
                    <SelectItem key={"Auto"} value={Mode.Auto}>Auto</SelectItem>
                    <SelectItem key={"Teleop"} value={Mode.Teleop}>Teleop</SelectItem>
                </Select>
            </div>

            <div className="flex justify-center gap-4">
                <div className="flex-col">
                    {data.teams.filter(team => team.alliance == Alliance.Red).map(team => (
                        <TeamData key={team.teamNumber} team={team} mode={mode}/>
                    ))}
                </div>

                <div className="flex-col justify-center">
                    {data.teams.filter(team => team.alliance == Alliance.Blue).map(team => (
                        <TeamData key={team.teamNumber} team={team} mode={mode}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

const TeamData = ({team, mode}: {team: TeamMatchData, mode: Mode}) => {
    if (mode == Mode.Auto) {
        return (<AutoView team={team} />)
    } else {
        return (<TeleopView team={team} />)
    }
}

const AutoView = ({team}: {team: TeamMatchData}) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const imageRef = useRef(null);

    useEffect(() => {
        const updateOffsets = () => {
            if (imageRef.current) {
                //@ts-ignore
                const rect = imageRef.current.getBoundingClientRect();
                console.log(rect.left + ", " + rect.top);
                setOffsetX(rect.left);
                setOffsetY(rect.top);
            }
        };

        window.addEventListener('resize', updateOffsets);
        updateOffsets();
        return () => {
            window.removeEventListener('resize', updateOffsets);
        };
    }, []);

    return (
        <>
            <a className="font-bold">{team.teamNumber}</a>
            <Divider/>

            <div className="flex flex-col gap-1">
                <a>{"Park: " + team.autoPark}</a>
                <a>{"Amp in auto (flex): " + team.autoNotesAttempted.filter(note => note.locationScored == ScoreLocation.Amp).length}</a>
                <a>Collected: {team.autoNotesCollected.map(note => (
                    <a key={note.time}>{note.location + " @ " + note.time + " "}</a>
                ))}</a>

                <Image ref={imageRef} src={team.alliance === Alliance.Red ? "/Red.png" : "/Blue.png"} width={350}
                       alt="Field"/>

                <div className="flex flex-col gap-1">
                    {team.autoNotesAttempted.map(note => {
                        if (note.locationScored === ScoreLocation.Amp) return null;
                        if (!note.locationShot) return null;

                        return (
                            <ShootPoint
                                key={note.time}
                                made={note.made}
                                x={(note.locationShot?.x * DOWNSCALE) + offsetX}
                                y={(note.locationShot?.y * DOWNSCALE) + offsetY}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    )
}

const TeleopView = ({team}: { team: TeamMatchData }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const imageRef = useRef(null);

    useEffect(() => {
        const updateOffsets = () => {
            if (imageRef.current) {
                //@ts-ignore
                const rect = imageRef.current.getBoundingClientRect();
                console.log(rect.left + ", " + rect.top);
                setOffsetX(rect.left);
                setOffsetY(rect.top);
            }
        };

        window.addEventListener('resize', updateOffsets);
        updateOffsets();
        return () => {
            window.removeEventListener('resize', updateOffsets);
        };
    }, []);

    return (
        <div className="flex flex-col">
            <a className="font-bold">{team.teamNumber}</a>
            <Divider/>

            <a>{"Amp: " + team.notesAttempted.filter(note => note.locationScored == ScoreLocation.Amp).length}</a>

            <a>{"Trap: " + team.trap}</a>

            <a>{"Climb: " + team.climb}</a>

            <a>{"Park: " + team.park}</a>

            <a>{"Defense: " + (team.defense ? "Yes, " + team.defenseScale : "No")}</a>

            <a>{"Comments: " + team.comments}</a>

            {team.humanPlayerAmp ?
                <>
                    <a>{"Amp Played: " + team.ampPlayed}</a>
                    <a>{"Amplify: " + team.amplify}</a>
                    <a>{"Microphone: " + team.microphone}</a>
                </> : <></>}

            <Image ref={imageRef} src={team.alliance === Alliance.Red ? "/Red.png" : "/Blue.png"} width={350}
                   alt="Field"/>

            <div className="flex flex-col gap-1">
                {team.notesAttempted.map(note => {
                    if (note.locationScored === ScoreLocation.Amp) return null;
                    if (!note.locationShot) return null;

                    return (
                        <ShootPoint
                            key={note.time}
                            made={note.made}
                            x={(note.locationShot?.x * DOWNSCALE) + offsetX}
                            y={(note.locationShot?.y * DOWNSCALE) + offsetY}
                        />
                    );
                })}
            </div>
        </div>
    )
}