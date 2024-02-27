"use client";

import {title} from "@/components/primitives";
import {useEffect, useState} from "react";
import {Data, parseFirebaseData, TeamMatchData} from "@/components/data";
import {readData} from "@/components/filesystem";
import {get, getDatabase, ref} from "@firebase/database";

export default function ViewerPage() {
    const [data, setData] = useState<TeamMatchData[] | null>(null);
    const [matchData, setMatchData] = useState<TeamMatchData[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

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

    async function convertMatches(teamMatchData: TeamMatchData[] | undefined) {
        if (!teamMatchData) { return; }

        var matches: Data | undefined = undefined;

        teamMatchData.map(teamData => {

        });
    }

    function findMatchInsert(arr: {matchNumber: number, teams: TeamMatchData[]}[], match: number, insert: TeamMatchData) {
        let current = 0;

        for (let num of arr) {
            if (num.matchNumber == match) {
                return [
                    ...arr.slice(0, current),
                    insert,
                    ...arr.slice(current)
                ]
            }

            current++;

        }
    }

    useEffect(() => {
        fetchAllMatches().then(value => convertMatches(value));
    }, []);

    return (
        <>
            <h1 className={title()}>Viewer</h1>
            <a>{data ? data.map(teamMatch => (
                <a key={teamMatch.teamNumber}>{teamMatch.teamNumber}</a>
            )) : ""}</a>
        </>
    )
}
