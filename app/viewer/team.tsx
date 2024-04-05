'use client';

import {Alliance, Climb, Park, ScoreLocation, TeamData, TeamMatchData, Trap} from "@/components/data";
import {Button} from "@nextui-org/button";
import {Divider, Image} from "@nextui-org/react";
import {useEffect, useRef, useState} from "react";
import {ShootPoint} from "@/components/shot";

export const TeamListView = ({data}: { data: TeamMatchData[] | undefined }) => {
    const [teams, setTeams] = useState<TeamData[] | null>(null)

    useEffect(() => {
        if (data) {
            const uniqueTeams: any[] = [];
            data.forEach(match => {
                if (!uniqueTeams.includes(match.teamNumber)) {
                    uniqueTeams.push(match.teamNumber);
                }
            });

            const teamsData = uniqueTeams.map(teamNumber => {
                const teamMatches = data.filter(match => match.teamNumber === teamNumber);
                return {
                    teamNumber,
                    data: teamMatches
                };
            });
            setTeams(teamsData);
        }
    }, [data]);

    if (!teams) return (<></>)

    return (
        <h1>Team List View</h1>
    )
}

export const TeamDetailView = ({data, updateSelectedTeam,}: {
    data: TeamMatchData[] | undefined;
    updateSelectedTeam: (arg0: number | null) => void;
}) => {
    const [fastestTimes, setFastestTimes] = useState<
        { location: string; time: number }[]
    >([]);

    useEffect(() => {
        if (data) {
            const notesByLocation: { [key: string]: number[] } = {};
            data.forEach((match) => {
                match.autoNotesCollected.forEach((note) => {
                    if (!notesByLocation[note.location]) {
                        notesByLocation[note.location] = [];
                    }
                    notesByLocation[note.location].push(note.time);
                });
            });

            const fastestTimesByLocation = Object.entries(notesByLocation).map(
                ([location, times]) => {
                    const fastestTime = Math.min(...times);
                    return { location, time: fastestTime };
                }
            );

            setFastestTimes(fastestTimesByLocation);
        }
    }, [data]);

    if (!data) { return (<></>) }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex">
                <Button variant="bordered" onPress={() => updateSelectedTeam(null)}>
                    Back
                </Button>
            </div>

            <h1 className="content-center font-bold text-3xl">
                {data?.[0]?.teamNumber}
            </h1>

            <div className="flex gap-4 justify-center content-center w-full h-5 items-center">
                <div>
                    <a>Average auto: </a>
                    <a className="text-green-600">
                        {data?.filter(
                            (match) => match.autoNotesAttempted.filter((note) => note.made)
                                .length
                        ).length / data?.length}
                    </a>

                    <a>/</a>

                    <a className="text-red-600">
                        {data?.filter(
                            (match) => match.autoNotesAttempted.filter((note) => !note.made).length
                        ).length / data?.length}
                    </a>
                </div>
                <Divider orientation="vertical"/>

                <div className="flex flex-col">
                    <a>
                        {"Park (good): " +
                            data.filter(match => match.park == Park.Good).length /
                            data.length + "%"}
                    </a>

                    <a>
                        {"Park (dangerous): " +
                            data.filter(match => match.park == Park.Dangerous).length /
                            data.length + "%"}
                    </a>
                </div>

                <div className="flex flex-col">
                    <a>{"Notes collected fastest: "}</a>
                    {fastestTimes.map(({location, time}) => (
                        <a key={location}>{`${location} @ ${time}`}</a>
                    ))}
                </div>

                <div>
                    <a>Average teleop: </a>
                    <a className="text-green-600">
                        {data?.filter(
                            (match) => match.notesAttempted.filter((note) => note.made)
                                .length
                        ).length / data?.length}
                    </a>

                    <a>/</a>

                    <a className="text-red-600">
                        {data?.filter(
                            (match) => match.notesAttempted.filter((note) => !note.made).length
                        ).length / data?.length}
                    </a>
                </div>

                <div>
                    <a>Averayyge climb: </a>
                    <a className="text-green-600">{data.filter(match => match.climb != Climb.None || Climb.Failed).length}</a>
                    <a>/</a>
                    <a className="text-red-600">{data.filter(match => match.climb == Climb.Solo || Climb.Double || Climb.Triple).length}</a>
                </div>

                <a>{"Trap (none, 1, 2, 3): " + data.filter(match => match.trap == Trap.None).length + ", " +
                    data.filter(match => match.trap == Trap.One).length + ", " +
                    data.filter(match => match.trap == Trap.Two).length + ", " +
                    data.filter(match => match.trap == Trap.Three).length}</a>

                <a>{"Park amount: " + data.map(match => match.park).length}</a>
            </div>
        </div>
    );
};
