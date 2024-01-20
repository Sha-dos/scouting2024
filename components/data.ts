export interface Team {
    number: string,
    autoPark: boolean,
    humanPlayerAmp: boolean,
    autoNotesCollected: AutoNoteCollected[],
    autoNotesAttempted: NoteShot[],
    teleopShots: NoteShot[],
    pickupLocation: PickupLocation,
    amplify: number,
    ampPlayed: AmpPlayed | null,
    defense: boolean,
    defenseScale: DefenseRange | null,
    trap: boolean,
    climb: Climb | false,
    microphone: MicrophoneShot | null,
    park: Park,
    comments: string
}

export interface AutoNoteCollected {
    time: number,
    location: AutoNote
}

export enum AutoNote {
    Close0 = "Close0", // 0 is closet to wall opposite of scoring table
    Close1 = "Close1",
    Close2 = "Close2",
    Mid0 = "Mid0",
    Mid1 = "Mid1",
    Mid2 = "Mid2",
    Mid3 = "Mid3",
    Mid4 = "Mid4"
}

export interface NoteShot {
    time: number | null,
    made: boolean,
    locationShot: FieldLocation | null,
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
    None = "None",
    Floor = "Floor",
    HumanPlayer = "Human Player",
    Both = "Both"
}

export enum AmpPlayed {
    Send = "Send",
    Accept = "Accept",
    Reject = "Reject"
}

export enum DefenseRange {
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

export enum Alliance {
    Red,
    Blue
}

export enum AppState {
    PreMatch,
    Auto,
    Teleop,
    PostMatch
}