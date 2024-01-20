import {Textarea} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import {Component} from "react";

export class Pregame extends Component<{
    matchNumber: any,
    setMatchNumber: any,
    teamNumber: any,
    setTeamNumber: any,
    humanPlayerAmp: any,
    setHumanPlayerAmp: any
}> {
    render() {
        let {matchNumber, setMatchNumber, teamNumber, setTeamNumber, humanPlayerAmp, setHumanPlayerAmp} = this.props;
        return (
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
        );
    }
}