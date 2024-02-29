"use client";

import {readData} from "@/components/filesystem";
import {useEffect, useState} from "react";
import {Data} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ScrollShadow, Spacer} from "@nextui-org/react";
import {getDatabase, ref, set} from "@firebase/database";
import {title} from "@/components/primitives";

export default function DataPage() {
    /*const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        readData().then(value => {
            if (typeof value === "string") {
                setData(JSON.parse(value));
            } })
    }, [data]);

    function upload() {
        const db = getDatabase();

        data?.matches.map(match => {
            set(ref(db, 'data/' + match.matchNumber + '/teams/' + match.teamNumber), {
                ampPlayed: match.ampPlayed,
                amplify: match.amplify,
                autoNotesAttempted: match.autoNotesAttempted,
                autoNotesCollected: match.autoNotesCollected,
                autoPark: match.autoPark,
                climb: match.climb,
                comments: match.comments,
                defense: match.defense,
                defenseScale: match.defenseScale,
                humanPlayerAmp: match.humanPlayerAmp,
                microphone: match.microphone,
                number: match.teamNumber,
                park: match.park,
                pickupLocation: match.pickupLocation,
                notesAttempted: match.notesAttempted,
                trap: match.trap
            });
        })
    }

    return (
        <div className="flex gap-4">
            <Button variant="bordered" onPress={() => upload()}>Upload All</Button>
            <h1>{"length: " + data?.matches.length}</h1>
            <ScrollShadow className="w-[300px] h-[500px]">
                <div className="flex flex-col gap-4">
                    {data?.matches.map(match => (
                        MatchList(match.matchNumber, match.teamNumber, match.comments)
                    ))}
                </div>
            </ScrollShadow>
        </div>
    );*/

return (
<h1>Data</h1>
)
}

function MatchList(match: number, team: number, comments: string) {
    return (
        <Button variant="bordered" className="space-y-24">
            <div className="flex gap-4">
                <a>{match}</a>
                <a>{team}</a>
                <a>{comments}</a>
            </div>
        </Button>
    )
}
