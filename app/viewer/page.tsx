"use client";

import {useEffect, useState} from "react";
import {Alliance, Data, parseFirebaseData, TeamMatchData} from "@/components/data";
import {get, getDatabase, ref} from "@firebase/database";
import {Button} from "@nextui-org/button";
import {Checkbox, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react";
import {ModalFooter} from "@nextui-org/modal";

export default function ViewerPage() {
    const [data, setData] = useState<TeamMatchData[] | null>(null);
    const [matchData, setMatchData] = useState<Data>();
    const [selectedTeam, setSelectedTeam] = useState(null);

    async function fetchAllMatches(): Promise<TeamMatchData[] | undefined> {
        const db = getDatabase();
        const dataRef = ref(db, 'data');

        try {
            const snapshot = await get(dataRef);
            const result = parseFirebaseData(snapshot.val());
            setData(result);
            return result;
        } catch (error) {
            console.error('Error fetching all matches data:', error);
        }
    }

    async function convertMatches(teamMatchDataArray: TeamMatchData[]): Promise<Data> {
        const matchesMap = new Map<number, TeamMatchData[]>();

        // Group TeamMatchData by matchNumber
        for (const teamMatchData of teamMatchDataArray) {
            if (!matchesMap.has(teamMatchData.matchNumber)) {
                matchesMap.set(teamMatchData.matchNumber, []);
            }
            matchesMap.get(teamMatchData.matchNumber)?.push(teamMatchData);
        }

        // Convert the map to the required format of Data
        const matches: { matchNumber: number, teams: TeamMatchData[] }[] = [];
//@ts-ignore
        for (const [matchNumber, teams] of matchesMap.entries()) {
            matches.push({ matchNumber, teams });
        }

        return { matches };
    }

    

    useEffect(() => {
//@ts-ignore
        fetchAllMatches().then(value => convertMatches(value).then(value1 => setMatchData(value1)));
    }, []);

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
                        <MatchView key={match.matchNumber} matchNumber={match.matchNumber} teams={match.teams}/>
                    </div>
                )
            })}
        </div>
    )
}

const MatchView = ({matchNumber, teams}: { matchNumber: number, teams: TeamMatchData[] }) => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className="flex content-evenly min-w-full">
            <Button variant="light">{matchNumber}</Button>

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