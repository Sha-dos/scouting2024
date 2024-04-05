"use client";

import {readData} from "@/components/filesystem";
import {useEffect, useState} from "react";
import {Data, TeamMatchData} from "@/components/data";
import {Button} from "@nextui-org/button";
import {getDatabase, ref, set} from "@firebase/database";

export default function DataPage() {
    const [data, setData] = useState<{matches: TeamMatchData[]} | null>(null);

    useEffect(() => {
        readData().then(value => {
            if (typeof value === "string") {
                setData(JSON.parse(value));
            } })
    }, []);

    async function upload() {
        const db = getDatabase();

        data?.matches.map(team => {
            set(ref(db, 'data/' + team.matchNumber + '/teams/' + team.teamNumber), {
                alliance: team.alliance,
                ampPlayed: team.ampPlayed,
                amplify: team.amplify,
                autoNotesAttempted: team.autoNotesAttempted,
                autoNotesCollected: team.autoNotesCollected,
                autoPark: team.autoPark,
                climb: team.climb,
                comments: team.comments,
                defense: team.defense,
                defenseScale: team.defenseScale,
                humanPlayerAmp: team.humanPlayerAmp,
                microphone: team.microphone,
                number: team.teamNumber,
                park: team.park,
                notesAttempted: team.notesAttempted,
                trap: team.trap
            });
        })
    }

    return (
        <div className="flex gap-4">
            <Button variant="bordered" onPress={() => upload()}>Upload All</Button>
            <Button onPress={() => localStorage.clear()}></Button>
            <h1>{"length: " + data?.matches.length}</h1>
        </div>
    );
}