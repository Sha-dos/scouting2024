import {Textarea} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import React, {Component, useEffect, useState} from "react";
import {Station} from "@/components/data";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Button} from "@nextui-org/button";

//@ts-ignore
export function Pregame({matchNumber, setMatchNumber, teamNumber, setTeamNumber, humanPlayerAmp, setHumanPlayerAmp, updateAlliance, station}) {
    const stations = [
        Station.Red1,
        Station.Red2,
        Station.Red3,
        Station.Blue1,
        Station.Blue2,
        Station.Blue3
    ]

    const updateStation = (sta: Station) => {
        updateAlliance(sta);
    }

    return (
        <div className="flex flex-col gap-8 items-center justify-center">
            <div className="flex justify-center gap-4">
                <Textarea
                    variant="underlined"
                    label="Match Number"
                    labelPlacement="outside"
                    maxRows={1}
                    type="number"
                    placeholder="0"
                    value={matchNumber}
                    onValueChange={setMatchNumber}
                />

                <Textarea
                    variant="underlined"
                    label="Team Number"
                    labelPlacement="outside"
                    maxRows={1}
                    type="number"
                    placeholder="0000"
                    value={teamNumber}
                    onValueChange={setTeamNumber}
                />

                <Checkbox width={25} isSelected={humanPlayerAmp} onValueChange={setHumanPlayerAmp}>Amp</Checkbox>

            </div>

            <Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered" className="w-1">
                        {station}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    {stations.map(sta => (
                        <DropdownItem onPress={() => updateStation(sta)} key={sta}>{sta}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}