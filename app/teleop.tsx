import {Image, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, useDisclosure} from "@nextui-org/react";
import React, {useEffect, useRef, useState} from "react";
import {Alliance, AmpPlayed, Climb, MicrophoneShot, NoteShot, Park, ScoreLocation} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ShootPoint} from "@/components/shot";
import {Checkbox} from "@nextui-org/checkbox";

// Should probably have field separate, but im too lazy
// @ts-ignore
export const Teleop = ({alliance, updateNotesAttempted, updatePark, humanPlayerAmp, updateAmpPlayed, updateMicrophone, updateClimb, updateTrap, updateAmplify}) => {
    const [notesAttempted, setNotesAttempted] = useState<NoteShot[]>([]);
    const [park, setPark] = useState<Park>(Park.None);
    const [ampPlayed, setAmpPlayed] = useState<AmpPlayed>(AmpPlayed.None);
    const [microphone, setMicrophone] = useState<MicrophoneShot>(MicrophoneShot.DidNotAttempt);
    const [climb, setClimb] = useState<Climb>(Climb.None);
    const [trap, setTrap] = useState(false);
    const [amplify, setAmplify] = useState(0);

    const [ampShots, setAmpShots] = useState(0);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        setX(e.pageX - offsetX);
        setY(e.pageY - offsetY);
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

    // @ts-ignore
    const handleMicrophoneChange = (e) => {
        setMicrophone(e.target.value);
        updateMicrophone(e.target.value);
    };

    // @ts-ignore
    const handleAmpChange = (e) => {
        setAmpPlayed(e.target.value);
        updateAmpPlayed(e.target.value);
    };

    // @ts-ignore
    const handleClimbChange = (e) => {
        setClimb(e.target.value);
        updateClimb(e.target.value);
    };

    // @ts-ignore
    const handleParkChange = (e) => {
        setPark(e.target.value);
        updatePark(e.target.value);
    };

    const ampList = [
        AmpPlayed.Send,
        AmpPlayed.Accept,
        AmpPlayed.Reject,
        AmpPlayed.None
    ]

    const microphoneList = [
        MicrophoneShot.DidNotAttempt,
        MicrophoneShot.First,
        MicrophoneShot.Second,
        MicrophoneShot.Third,
        MicrophoneShot.Failed
    ]

    const climbList = [
        Climb.Solo,
        Climb.Double,
        Climb.Triple,
        Climb.Failed,
        Climb.None
    ]

    const parkList = [
        Park.Dangerous,
        Park.Good,
        Park.Failed,
        Park.None
    ]

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const imageRef = useRef(null);

    useEffect(() => {
        const updateOffsets = () => {
            if (imageRef.current) {
                //@ts-ignore
                const rect = imageRef.current.getBoundingClientRect();
                console.log(rect.left + ", " + rect.top);
                setOffsetX(rect.left);
                setOffsetY(rect.top);
            }
        };

        window.addEventListener('resize', updateOffsets);
        updateOffsets();
        return () => {
            window.removeEventListener('resize', updateOffsets);
        };
    }, []);

    return (
        <div className="flex justify-center gap-4">
            <Image onClick={(e) => {handleClick(e); onOpen()}} width={450} src={alliance == Alliance.Red ? "./Red.png" : "./Blue.png"} alt={"Field"} />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 justify-center">Made the shot?</ModalHeader>
                            <ModalBody>
                                <Button variant="bordered" onPress={() => {
                                    onClose();
                                    handleShotPoint(true, ScoreLocation.Speaker);
                                }}>Yes</Button>
                                <Button variant="bordered" onPress={() => {
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
                                attempt.locationShot ? <ShootPoint
                                    made={attempt.made}
                                    x={attempt.locationShot.x + offsetX}
                                    y={attempt.locationShot.y + offsetY}
                                /> : <></>
                            }
                            {/*<a className="font-mono">{index + ". " + attempt.made + " " + attempt.locationScored.toString() + " @ " + attempt.time} <br/> </a>*/}
                        </>
                    );
                })}
            </div>

            <div className="flex flex-col gap-4">
                <h2>Scoring</h2>
                <Button variant="bordered" onPress={() => handleShotPoint(true, ScoreLocation.Amp)}>{"Amp: " + ampShots}</Button>
                {/*<Button color="primary" variant="bordered" onPress={() => handleShotPoint(true, ScoreLocation.Trap)}>Trap</Button>*/}
            </div>

            <div className="flex flex-col gap-4">
                <h2>Human Player</h2>
                <Select
                    label="Co op"
                    variant="bordered"
                    placeholder="Select"
                    isDisabled={!humanPlayerAmp}
                    selectedKeys={ampPlayed ? [ampPlayed] : []}
                    className="max-w-xs"
                    onChange={handleAmpChange}
                >
                    {ampList.map((amp) => (
                        <SelectItem key={amp} value={amp}>
                            {amp}
                        </SelectItem>
                    ))}
                </Select>

                <Button variant="bordered" isDisabled={!humanPlayerAmp} onPress={() => {setAmplify(prevState => prevState + 1); updateAmplify()}}>
                    {"Amplify: " + amplify}
                </Button>

                <Select
                    label="Microphone"
                    variant="bordered"
                    placeholder="Select"
                    isDisabled={!humanPlayerAmp}
                    selectedKeys={microphone ? [microphone] : []}
                    className="max-w-xs"
                    onChange={handleMicrophoneChange}
                >
                    {microphoneList.map((mic) => (
                        <SelectItem key={mic} value={mic}>
                            {mic}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="flex w-32">Endgame</h2>
                <Select
                    label="Climb"
                    variant="bordered"
                    placeholder="Select"
                    selectedKeys={climb ? [climb] : []}
                    className="max-w-xs"
                    onChange={handleClimbChange}
                >
                    {climbList.map((climb) => (
                        <SelectItem key={climb} value={climb}>
                            {climb}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Park"
                    variant="bordered"
                    placeholder="Select"
                    selectedKeys={park ? [park] : []}
                    className="max-w-xs"
                    onChange={handleParkChange}
                >
                    {parkList.map((park) => (
                        <SelectItem key={park} value={park}>
                            {park}
                        </SelectItem>
                    ))}
                </Select>

                <Checkbox isSelected={trap} onValueChange={(trap) => {setTrap(trap); updateTrap(trap)}}>Trap</Checkbox>
            </div>
        </div>
    )
}