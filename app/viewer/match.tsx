'use client';

import {Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react";
import {Alliance, Data, ScoreLocation, TeamMatchData} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ModalFooter} from "@nextui-org/modal";
import {ShootPoint} from "@/components/shot";
import {useEffect, useRef, useState} from "react";

export const MatchListView = ({matchData, updateSelectedMatch}: {matchData: Data | undefined, updateSelectedMatch: (arg0: number | null) => void}) => {
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
                        <MatchView key={match.matchNumber} matchNumber={match.matchNumber} teams={match.teams} updateSelectedMatch={updateSelectedMatch}/>
                    </div>
                )
            })}
        </div>
    )
}

const MatchView = ({matchNumber, teams, updateSelectedMatch}:
                       { matchNumber: number, teams: TeamMatchData[], updateSelectedMatch: (arg0: number | null) => void }) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className="flex content-evenly min-w-full">
            <Button variant="light" onPress={() => updateSelectedMatch(matchNumber)}>{matchNumber}</Button>

            {/* Why not being shown? */}
            <Divider as="div" orientation="vertical"/>

            <div className="flex flex-col gap-4 min-w-full">
                {teams.map((team, idx) => (
                    <div className="flex min-w-[85%]" key={team.teamNumber}>
                        <Button onPress={onOpen} variant="light" key={idx} className="justify-start flex gap-4">{
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
                            </>
                        }</Button>

                        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">{team.teamNumber}</ModalHeader>
                                        <ModalBody>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const MatchDetailView = ({data, updateSelectedMatch}:
                                    {data: { matchNumber: number, teams: TeamMatchData[] } | undefined, updateSelectedMatch: (arg0: number | null) => void}) => {
    if (!data) { return(<></>); }

    return (
        <div className="flex flex-col">
            <div className="flex">
                <Button variant="bordered" onPress={() => updateSelectedMatch(null)}>Back</Button>
            </div>

            <h1 className="content-center font-bold text-3xl">{data.matchNumber}</h1>

            <div className="flex justify-center gap-4">
                <div className="flex-col">
                    {data.teams.filter(team => team.alliance == Alliance.Red).map(team => (
                        <TeamData key={team.teamNumber} team={team}/>
                    ))}
                </div>

                <div className="flex-col justify-center">
                    {data.teams.filter(team => team.alliance == Alliance.Blue).map(team => (
                        <TeamData key={team.teamNumber} team={team}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

const TeamData = ({team}: {team: TeamMatchData}) => {
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

            {team.autoNotesCollected.map(note => (
                <a key={note.time}>{note.location + " @ " + note.time}</a>
            ))}

            <Image ref={imageRef} src={team.alliance === Alliance.Red ? "/Red.png" : "/Blue.png"} width={350} alt="Field"/>

            <div className="flex flex-col gap-1">
                {team.autoNotesAttempted.map(note => {
                    if (note.locationScored === ScoreLocation.Amp) return null;
                    if (!note.locationShot) return null;

                    return (
                        <ShootPoint
                            key={note.time}
                            made={note.made}
                            x={(note.locationShot?.x * 0.7777777) + offsetX}
                            y={(note.locationShot?.y * 0.7777777) + offsetY}
                        />
                    );
                })}
            </div>
        </>
    )
}