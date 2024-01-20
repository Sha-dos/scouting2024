import {Button} from "@nextui-org/button";
import {Checkbox} from "@nextui-org/checkbox";
import React, {useState} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider} from "@nextui-org/react";
import {PickupLocation} from "@/components/data";
import {Textarea} from "@nextui-org/input";

// @ts-ignore
export const PostGame = ({updateDefense, updatePickupLocation, updateDefenseScale, updateComments}) => {
    const [defense, setDefense] = useState(false);
    const [pickupLocation, setPickupLocation] = useState(PickupLocation.None);
    const [defenseScale, setDefenseScale] = useState<number | number[]>(2);
    const [comments, setComments] = useState("");

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

            <Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                        Pickup Location
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem onPress={() => {setPickupLocation(PickupLocation.None); updatePickupLocation(PickupLocation.None)}} className={
                        pickupLocation == PickupLocation.None ? "text-success" : "text-primary"
                    } key="accept">None</DropdownItem>

                    <DropdownItem onPress={() => {setPickupLocation(PickupLocation.Floor); updatePickupLocation(PickupLocation.Floor)}} className={
                        pickupLocation == PickupLocation.Floor ? "text-success" : "text-primary"
                    } key="accept">Floor</DropdownItem>

                    <DropdownItem onPress={() => {setPickupLocation(PickupLocation.HumanPlayer); updatePickupLocation(PickupLocation.HumanPlayer)}} className={
                        pickupLocation == PickupLocation.HumanPlayer ? "text-success" : "text-primary"
                    } key="accept">Human Player</DropdownItem>

                    <DropdownItem onPress={() => {setPickupLocation(PickupLocation.Both); updatePickupLocation(PickupLocation.Both)}} className={
                        pickupLocation == PickupLocation.Both ? "text-success" : "text-primary"
                    } key="accept">Both</DropdownItem>
                </DropdownMenu>
            </Dropdown>

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