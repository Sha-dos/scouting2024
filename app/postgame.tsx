import {Button} from "@nextui-org/button";
import {Checkbox} from "@nextui-org/checkbox";
import React, {useState} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem, Slider} from "@nextui-org/react";
import {PickupLocation} from "@/components/data";
import {Textarea} from "@nextui-org/input";

// @ts-ignore
export const PostGame = ({updateDefense, updatePickupLocation, updateDefenseScale, updateComments}) => {
    const [defense, setDefense] = useState(false);
    const [pickupLocation, setPickupLocation] = useState(PickupLocation.None);
    const [defenseScale, setDefenseScale] = useState<number | number[]>(2);
    const [comments, setComments] = useState("");

    const handlePickupChange = (e) => {
        setPickupLocation(e.target.value)
    }

    const pickupLocationList = [
        PickupLocation.None,
        PickupLocation.Floor,
        PickupLocation.HumanPlayer,
        PickupLocation.Both,
    ]

    return (
        <>
            <Checkbox color="primary" isSelected={defense} onValueChange={(value) => {setDefense(value); updateDefense(value)}}>
                Defense
            </Checkbox>

            <Slider
                isDisabled={!defense}
                label="Select a value"
                color="foreground"
                size="sm"
                minValue={0}
                maxValue={4}
                hideValue={true}
                value={defenseScale}
                onChange={(value) => {setDefenseScale(value); updateDefenseScale(value)}}
                step={1}
                marks={[
                    {
                        value: 0,
                        label: "Bad",
                    },
                    {
                        value: 1,
                        label: "Okay",
                    },
                    {
                        value: 2,
                        label: "Average",
                    },
                    {
                        value: 3,
                        label: "good",
                    },
                    {
                        value: 4,
                        label: "Exceptional"
                    }
                ]}
                className="max-w-md"
            />

            <Select
                label="Pickup"
                variant="bordered"
                placeholder="Select"
                selectedKeys={[pickupLocation]}
                className="max-w-xs"
                onChange={handlePickupChange}
            >
                {pickupLocationList.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                        {loc}
                    </SelectItem>
                ))}
            </Select>

            <Textarea
                variant="underlined"
                label="Comments"
                labelPlacement="outside"
                maxRows={2}
                placeholder="mid"
                value={comments}
                onValueChange={(value) => {setComments(value); updateComments(value)}}
            />
        </>
    )
}