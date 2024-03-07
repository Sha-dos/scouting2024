"use client";

import {useEffect, useState} from "react";
import {Alliance, Data, parseFirebaseData, TeamMatchData} from "@/components/data";
import {get, getDatabase, ref} from "@firebase/database";
import {Button, ButtonGroup} from "@nextui-org/button";
import {MatchDetailView, MatchListView} from "@/app/viewer/match";
import {TeamDetailView, TeamListView} from "@/app/viewer/team";

enum View {
    Matches,
    Teams
}

export default function ViewerPage() {
    const [data, setData] = useState<TeamMatchData[] | null>(null);
    const [matchData, setMatchData] = useState<Data>();
    const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

    const [view, setView] = useState(View.Matches);

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

    function updateSelectedMatch(match: number | null) {
        setSelectedMatch(match)
    }

    function updateSelectedTeam(team: number | null) {
        setSelectedTeam(team)
    }

    useEffect(() => {
        //@ts-ignore
        fetchAllMatches().then(value => convertMatches(value).then(value1 => setMatchData(value1)));
    }, []);

    if (selectedMatch) {
        return (
            <MatchDetailView
                data={matchData?.matches.find(match => match.matchNumber == selectedMatch)}
                updateSelectedMatch={updateSelectedMatch}
            />
        )
    } else if (selectedTeam) {
        return (
            <TeamDetailView data={matchData?.matches.flatMap(
                match => match.teams.filter(
                    team => team.teamNumber == selectedTeam
                ))} updateSelectedTeam={updateSelectedTeam} />
        )
    } else {
        return (
            <>
                <ButtonGroup>
                    <Button variant="bordered" onPress={() => setView(View.Matches)}>Matches</Button>
                    <Button variant="bordered" onPress={() => setView(View.Teams)}>Teams</Button>
                </ButtonGroup>

                {view == View.Matches ? <MatchListView matchData={matchData} updateSelectedMatch={updateSelectedMatch} updateSelectedTeam={updateSelectedTeam}/> : <TeamListView />}
            </>
        )
    }
}