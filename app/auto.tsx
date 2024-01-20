import React, {useEffect, useRef, useState} from "react"
import {Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {Alliance, AutoNote, AutoNoteCollected, NoteShot, ScoreLocation} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ShootPoint} from "@/components/shot";

// @ts-ignore
export const Auto = ({alliance, autoNotesCollected, updateAutoNotesCollected, autoNotesAttempted, updateAutoNotesAttempted, autoPark updateAutoPark}) => {
        /*const [autoNotesCollected, setAutoNotesCollected] = useState<AutoNoteCollected[]>([]);
        const [autoNotesAttempted, setAutoNotesAttempted] = useState<NoteShot[]>([]);
        const [autoPark, setAutoPark] = useState(false);*/

        // Modal
        const {isOpen, onOpen, onOpenChange} = useDisclosure();

        const [time, setTime] = useState(0);
        const [running, setRunning] = useState(true);
        const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
        const startTimeRef = useRef(0);

        const startStopwatch = () => {
            startTimeRef.current = Date.now() - time * 100;
            intervalRef.current = setInterval(() => {
                setTime(Number(((Date.now() - startTimeRef.current) / 1000).toFixed(1)));
            }, 100);
            setRunning(true);
        };

        const pauseStopwatch = () => {
            clearInterval(intervalRef.current);
            setRunning(false);
        };

        useEffect(() => {
            if (running) {
                startStopwatch();
            }
            return () => {
                clearInterval(intervalRef.current);
            };
        }, [running]);

        const [x, setX] = useState(0);
        const [y, setY] = useState(0);

        const handleClick = (e: MouseEvent) => {
            setX(e.clientX);
            setY(e.clientY);
        }

        const handleShotPoint = (made: boolean, amp: boolean) => {
           !amp ? setAutoNotesAttempted(prevState => [...prevState, {
                time: time,
                made: made,
                locationShot: {
                    x: x,
                    y: y,
                    distance: 0,
                    angle: 0
                },
                locationScored: ScoreLocation.Speaker
            }]) : setAutoNotesAttempted(prevState => [...prevState, {
                time: time,
                made: made,
                locationShot: undefined,
                locationScored: ScoreLocation.Amp
            }])
        }

        const handleCollect = (location: AutoNote) => {
            setAutoNotesCollected(prevState => [
                ...prevState, { time: time, location: location }
            ])
        }

        return (
            <>
            <h1 className="tracking-tight inline font-semibold text-[2.3rem] lg:text-4xl leading-9">{time}</h1>
            <div className="space-y-2">
                {/*<Button color="primary" variant="bordered" onPress={() => {
                    setAutoNotesCollected([]);
                    setAutoNotesAttempted([]);
                    setAutoPark(false)
                }}>Clear</Button>*/}
                <div className="flex justify-center gap-4">
                    <div className="flex flex-col gap-16">
                        <Button color="primary" variant="bordered" onPress={() => handleCollect(AutoNote.Mid4)}>Grab</Button>
                        <Button color="primary" variant="bordered" onPress={() => handleCollect(AutoNote.Mid3)}>Grab</Button>
                        <Button color="primary" variant="bordered" onPress={() => handleCollect(AutoNote.Mid2)}>Grab</Button>
                        <Button color="primary" variant="bordered" onPress={() => handleCollect(AutoNote.Mid1)}>Grab</Button>
                        <Button color="primary" variant="bordered" onPress={() => handleCollect(AutoNote.Mid0)}>Grab</Button>
                    </div>

                    <Image onClick={(e) => {handleClick(e); onOpen()}} width={450} src={alliance == Alliance.Red ? "./Red.png" : "./Blue.png"} alt={"Field"} />

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 justify-center">Made the shot?</ModalHeader>
                                    <ModalBody>
                                        <Button color="primary" variant="bordered" onPress={() => {
                                            onClose();
                                            handleShotPoint(true, false);
                                        }}>Yes</Button>
                                        <Button color="primary" variant="bordered" onPress={() => {
                                            onClose();
                                            handleShotPoint(false, false);
                                        }}>No</Button>
                                        <Button color="danger" variant="bordered" onPress={onClose}>Cancel</Button>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>

                    <div className="flex flex-col gap-4">
                        <Button color="primary" variant="bordered" onPress={() => handleShotPoint(true, true)}>Amp</Button>
                        <Button color="primary" variant="bordered" onPress={() => setAutoPark(true)}>Park</Button>
                    </div>

                    {/*<div className="flex flex-col gap-16">
                        <a className="font-mono">Notes Grabbed:</a>
                        <a className="font-mono">{autoNotesCollected ? autoNotesCollected?.map((collected, index) => {
                            return(<><a>{index + ". " + collected.location + " @ " + collected.time} <br/></a></>);
                        }) : "No Notes Grabbed"}</a>
                    </div>*/}
                    <div className="flex flex-col gap-1">
                        {/*<a className="font-mono">Notes Shot:</a>*/}
                        {autoNotesAttempted.map((attempt, index) => {
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
                </div>
            </div>
            </>
        );
   // }
}