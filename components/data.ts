export interface Team {
    number: string,
    autoPark: boolean,
    humanPlayerAmp: boolean,
    autoNotesCollected: AutoNoteCollected[],
    autoNotesAttempted: NoteShot[],
    pickupLocation: PickupLocation,
    ampPlayed: AmpPlayed,
    defense: boolean,
    defenseScale: DefenseRange,
    trap: boolean,
    climb: Climb,
    microphone: MicrophoneShot,
    park: Park,
    comments: string
}

export interface AutoNoteCollected {
    time: number,
    location: AutoNote
}

export enum AutoNote {
    Close0, // 0 is closet to wall / scoring table
    Close1,
    Close2,
    Mid0,
    Mid1,
    Mid2,
    Mid3,
    Mid4
}

export interface NoteShot {
    time: number,
    made: boolean,
    locationShot: FieldLocation,
    locationScored: ScoreLocation
}

export interface FieldLocation {
    x: number,
    y: number,
    distance: number,
    angle: number
}

export enum ScoreLocation {
    Speaker = "Speaker", // High
    Amp = "Amp", // Low
    Trap = "Trap"
}

export enum PickupLocation {
    Floor = "Floor",
    HumanPlayer = "Human Player",
    Both = "Both"
}

export enum AmpPlayed {
    Amplify,
}

export enum DefenseRange {
    NoDefense = "No Defense",
    Bad = "Bad",
    Okay = "Okay",
    Average = "Average",
    Good = "Good",
    Exceptional = "Exceptional"
}

export enum Climb {
    Attempted = "Attempted",
    Solo = "Solo",
    Double = "Double",
    Triple = "Triple"
}

export enum MicrophoneShot {
    DidNotAttempt = "Did Not Attempt",
    Failed = "Failed",
    First = "First",
    Second = "Second",
    Third = "Third"
}

export interface Park {
    succeed: boolean,
    away: boolean
}