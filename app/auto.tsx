import React, {useEffect, useRef, useState} from "react"
import {Checkbox, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/react"
import {Alliance, AutoNote, AutoNoteCollected, NoteShot, ScoreLocation} from "@/components/data";
import {Button} from "@nextui-org/button";
import {ShootPoint} from "@/components/shot";

// @ts-ignore
export const Auto = ({alliance, updateAutoNotesCollected, updateAutoNotesAttempted, updateAutoPark}) => {
        const [autoNotesCollected, setAutoNotesCollected] = useState<AutoNoteCollected[]>([]);
        const [autoNotesAttempted, setAutoNotesAttempted] = useState<NoteShot[]>([]);
        const [autoPark, setAutoPark] = useState(false);
        const [ampShots, setAmpShots] = useState(0);

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

        const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
            setX(e.pageX - offsetX);
            setY(e.pageY - offsetY);
        }

        const handlePark = (e: boolean) => {
            setAutoPark(e)
            updateAutoPark(e)
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
                setAmpShots(prevState => prevState + 1);
                value = {
                    time: null,
                    made: made,
                    locationShot: null,
                    locationScored: ScoreLocation.Amp
                }
            } else {
                value = {
                    time: null,
                    made: made,
                    locationShot: null,
                    locationScored: ScoreLocation.Trap
                }
            }

            setAutoNotesAttempted(prevState => [
                ...prevState, value
            ]);

            updateAutoNotesAttempted(value);
    }

        const handleCollect = (note: AutoNote) => {
            const existingIndex = autoNotesCollected.findIndex(item => item.location === note);

            if (existingIndex !== -1) {

                // If the note is already selected, remove it
                setAutoNotesCollected(prevNotes => [
                    ...prevNotes.slice(0, existingIndex),
                    ...prevNotes.slice(existingIndex + 1)
                ]);
                updateAutoNotesCollected(null, true, existingIndex);
            } else {

                // If the note is not selected, add it
                setAutoNotesCollected(prevNotes => [
                ...prevNotes,
                { time: time, location: note }
            ]);

            updateAutoNotesCollected({time: time, location: note}, false, existingIndex);
          }
        }

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
            <>
            <h1 className="tracking-tight inline font-semibold text-[2.3rem] lg:text-4xl leading-9">{time}</h1>
            <div className="space-y-2">
                {/*<Button color="primary" variant="bordered" onPress={() => {
                    setAutoNotesCollected([]);
                    setAutoNotesAttempted([]);
                    setAutoPark(false)
                }}>Clear</Button>*/}
                <div className="flex justify-center gap-4">
                    <div className="flex flex-col gap-20">
                        <Checkbox isSelected={autoNotesCollected.some(item => item.location === AutoNote.Mid4)} onValueChange={() => handleCollect(AutoNote.Mid4)}></Checkbox>
                        <Checkbox isSelected={autoNotesCollected.some(item => item.location === AutoNote.Mid3)} onValueChange={() => handleCollect(AutoNote.Mid3)}></Checkbox>
                        <Checkbox isSelected={autoNotesCollected.some(item => item.location === AutoNote.Mid2)} onValueChange={() => handleCollect(AutoNote.Mid2)}></Checkbox>
                        <Checkbox isSelected={autoNotesCollected.some(item => item.location === AutoNote.Mid1)} onValueChange={() => handleCollect(AutoNote.Mid1)}></Checkbox>
                        <Checkbox isSelected={autoNotesCollected.some(item => item.location === AutoNote.Mid0)} onValueChange={() => handleCollect(AutoNote.Mid0)}></Checkbox>
                    </div>

                    {/*<a>{autoNotesCollected.map(note => (note.location))}</a>*/}

                    <Image
                        onClick={(e) => {handleClick(e); onOpen()}}
                        width={450}
                        src={alliance == Alliance.Red ? "./Red.png" : "./Blue.png"} alt={"Field"}
                        ref={imageRef}
                    />

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 justify-center">Made the shot?</ModalHeader>
                                    <ModalBody>
                                        <Button variant="bordered" onPress={() => {
                                            onClose();
                                            handleShotPoint(true, ScoreLocation.Speaker)
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

                    <div className="flex flex-col gap-4">
                        <Button variant="bordered" onPress={() => handleShotPoint(true, ScoreLocation.Amp)}>
                            {"Amp: " + ampShots}
                        </Button>
                        <Checkbox isSelected={autoPark} onValueChange={handlePark}>Park</Checkbox>
                    </div>

                    {/*<div className="flex flex-col gap-16">
                        <a className="font-mono">Notes Grabbed:</a>
                        <a className="font-mono">{autoNotesCollected.length > 0 ? autoNotesCollected?.map((collected, index) => {
                            return(<><a>{index + ". " + collected.location + " @ " + collected.time} <br/></a></>);
                        }) : "No Notes Grabbed"}</a>
                    </div>*/}
                    <div className="flex flex-col gap-1">
                        {/*<a className="font-mono">Notes Shot:</a>*/}
                        {autoNotesAttempted.map((attempt, index) => {
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
                </div>
            </div>
            </>
        );
   // }
}
