import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import React, {useState} from "react";
import {Alliance, AmpPlayed, Climb, MicrophoneShot, NoteShot, Park, ScoreLocation} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ShootPoint} from "@/components/shot";
import {Checkbox} from "@nextui-org/checkbox";

// Should probably have field separate, but im too lazy
// @ts-ignore
export const Teleop = ({alliance, updateNotesAttempted, updatePark, humanPlayerAmp, updateAmpPlayed, updateMicrophone, updateClimb, updateTrap, updateAmplify}) => {
    const [notesAttempted, setNotesAttempted] = useState<NoteShot[]>([]);
    const [park, setPark] = useState<Park>({succeed: false, away: false});
    const [ampPlayed, setAmpPlayed] = useState<AmpPlayed | undefined>(undefined);
    const [microphone, setMicrophone] = useState<MicrophoneShot | undefined>(undefined);
    const [climb, setClimb] = useState<Climb | false>(false);
    const [trap, setTrap] = useState(false);
    const [amplify, setAmplify] = useState(0);

    const [ampShots, setAmpShots] = useState(0);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleClick = (e: MouseEvent) => {
        setX(e.clientX);
        setY(e.clientY);
    }

    const handleShotPoint = (made: boolean, location: ScoreLocation) => {
        let value: any;

        if (location == ScoreLocation.Speaker) {
            value = {
                time: null,
                made: made,
                locationShot: {
                   x: x,
                    y: y,
                    distance: 0,
                    angle: 0
                },
                locationScored: ScoreLocation.Speaker}
        } else if (location == ScoreLocation.Amp) {
            value = {
                time: null,
                made: made,
                locationShot: null,
                locationScored: ScoreLocation.Amp}
            setAmpShots(prevState => prevState + 1);
        } else {
            value = {
                time: null,
                made: made,
                locationShot: null,
                locationScored: ScoreLocation.Trap
            }
        }

        setNotesAttempted(prevState => [
            ...prevState, value
        ]);

        updateNotesAttempted(value);
    }

    return (
        <div className="flex justify-center gap-4">
            <Image onClick={(e) => {handleClick(e); onOpen()}} width={450} src={alliance == Alliance.Red ? "./Red.png" : "./Blue.png"} alt={"Field"} />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 justify-center">Made the shot?</ModalHeader>
                            <ModalBody>
                                <Button color="primary" variant="bordered" onPress={() => {
                                    onClose();
                                    handleShotPoint(true, ScoreLocation.Speaker);
                                }}>Yes</Button>
                                <Button color="primary" variant="bordered" onPress={() => {
                                    onClose();
                                    handleShotPoint(false, ScoreLocation.Speaker);
                                }}>No</Button>
                                <Button color="danger" variant="bordered" onPress={onClose}>Cancel</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex flex-col gap-1">
                {/*<a className="font-mono">Notes Shot:</a>*/}
                {notesAttempted.map((attempt, index) => {
                    return (
                        <>
                            {
                                attempt.locationShot ? <ShootPoint made={attempt.made} x={attempt.locationShot.x} y={attempt.locationShot.y} /> : <></>
                            }
                            {/*<a className="font-mono">{index + ". " + attempt.made + " " + attempt.locationScored.toString() + " @ " + attempt.time} <br/> </a>*/}
                        </>
                    );
                })}
            </div>

            <div className="flex flex-col gap-4">
                <h2>Scoring</h2>
                <Button color="primary" variant="bordered" onPress={() => handleShotPoint(true, ScoreLocation.Amp)}>{"Amp: " + ampShots}</Button>
                {/*<Button color="primary" variant="bordered" onPress={() => handleShotPoint(true, ScoreLocation.Trap)}>Trap</Button>*/}
            </div>

            <div className="flex flex-col gap-4">
                <h2>Human Player</h2>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" color="primary" isDisabled={!humanPlayerAmp}>
                            Co-op Played
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem onPress={() => {setAmpPlayed(AmpPlayed.Send); updateAmpPlayed(AmpPlayed.Send)}} className={
                            ampPlayed == AmpPlayed.Send ? "text-success" : "text-primary"
                        } key="send">Send</DropdownItem>

                        <DropdownItem onPress={() => {setAmpPlayed(AmpPlayed.Accept); updateAmpPlayed(AmpPlayed.Accept)}} className={
                            ampPlayed == AmpPlayed.Accept ? "text-success" : "text-primary"
                        } key="accept">Accept</DropdownItem>

                        <DropdownItem onPress={() => {setAmpPlayed(AmpPlayed.Reject); updateAmpPlayed(AmpPlayed.Reject)}} className={
                            ampPlayed == AmpPlayed.Reject ? "text-success" : "text-primary"
                        } key="reject">Reject</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Button variant="bordered" color="primary" isDisabled={!humanPlayerAmp} onPress={() => {setAmplify(prevState => prevState + 1); updateAmplify()}}>
                    {"Amplify: " + amplify}
                </Button>

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" color="primary" isDisabled={!humanPlayerAmp}>
                            Microphone
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem onPress={() => {setMicrophone(MicrophoneShot.DidNotAttempt); updateMicrophone(MicrophoneShot.DidNotAttempt)}} className={
                            microphone == MicrophoneShot.DidNotAttempt ? "text-success" : "text-primary"
                        } key="send">Did not attempt</DropdownItem>

                        <DropdownItem onPress={() => {setMicrophone(MicrophoneShot.First); updateMicrophone(MicrophoneShot.First)}} className={
                            microphone == MicrophoneShot.First ? "text-success" : "text-primary"
                        } key="accept">First</DropdownItem>

                        <DropdownItem onPress={() => {setMicrophone(MicrophoneShot.Second); updateMicrophone(MicrophoneShot.Second)}} className={
                            microphone == MicrophoneShot.Second ? "text-success" : "text-primary"
                        } key="reject">Second</DropdownItem>

                        <DropdownItem onPress={() => {setMicrophone(MicrophoneShot.Third); updateMicrophone(MicrophoneShot.Third)}} className={
                            microphone == MicrophoneShot.Third ? "text-success" : "text-primary"
                        } key="reject">Third</DropdownItem>

                        <DropdownItem onPress={() => {setMicrophone(MicrophoneShot.Failed); updateMicrophone(MicrophoneShot.Failed)}} className={
                            microphone == MicrophoneShot.Failed ? "text-success" : "text-primary"
                        } key="reject">Failed</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="flex flex-col gap-4">
                <h2>Endgame</h2>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" color="primary">
                            Climb
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem onPress={() => {setClimb(Climb.Attempted); updateClimb(Climb.Attempted)}} className={
                            climb == Climb.Attempted ? "text-success" : "text-primary"
                        } key="send">Failed</DropdownItem>

                        <DropdownItem onPress={() => {setClimb(Climb.Solo); updateClimb(Climb.Solo)}} className={
                            climb == Climb.Solo ? "text-success" : "text-primary"
                        } key="accept">Solo</DropdownItem>

                        <DropdownItem onPress={() => {setClimb(Climb.Double); updateClimb(Climb.Double)}} className={
                            climb == Climb.Double ? "text-success" : "text-primary"
                        } key="reject">Double</DropdownItem>

                        <DropdownItem onPress={() => {setClimb(Climb.Triple); updateClimb(Climb.Triple)}} className={
                            climb == Climb.Triple ? "text-success" : "text-primary"
                        } key="reject">Triple</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" color="primary">
                            Park
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem onPress={() => {setPark({succeed: false, away: false}); updatePark({succeed: false, away: false})}} className={
                            !park.succeed ? "text-success" : "text-primary"
                        } key="accept">No</DropdownItem>

                        <DropdownItem onPress={() => {setPark({succeed: true, away: false}); updatePark({succeed: true, away: false})}} className={
                            park.succeed && !park.away ? "text-success" : "text-primary"
                        } key="send">Yes</DropdownItem>

                        <DropdownItem onPress={() => {setPark({succeed: true, away: true}); updatePark({succeed: true, away: true})}} className={
                            park.succeed && park.away ? "text-success" : "text-primary"
                        } key="reject">Yes & Away</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Checkbox isSelected={trap} onValueChange={(trap) => {setTrap(trap); updateTrap(trap)}}>Trap</Checkbox>
            </div>
        </div>
    )
}