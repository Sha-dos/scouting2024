export interface Data {
    matches: TeamMatchData[]
}

export interface TeamMatchData {
    teamNumber: number,
    matchNumber: number,
    humanPlayerAmp: boolean,
    autoNotesAttempted: NoteShot[],
    autoNotesCollected: AutoNoteCollected[],
    autoPark: boolean,
    notesAttempted: NoteShot[],
    park: Park,
    ampPlayed: AmpPlayed,
    microphone: MicrophoneShot,
    climb: Climb,
    trap: boolean,
    amplify: number,
    defense: boolean,
    pickupLocation: PickupLocation,
    defenseScale: DefenseRange,
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
    Reject = "Reject",
    None = "None"
}

export enum DefenseRange {
    Bad = "Bad",
    Okay = "Okay",
    Average = "Average",
    Good = "Good",
    Exceptional = "Exceptional"
}

export enum Climb {
    Failed = "Failed",
    Solo = "Solo",
    Double = "Double",
    Triple = "Triple",
    None = "None"
}

export enum MicrophoneShot {
    DidNotAttempt = "None",
    Failed = "Failed",
    First = "First",
    Second = "Second",
    Third = "Third"
}

export enum Park {
    Dangerous = "Dangerous",
    Good = "Good",
    Failed = "Failed",
    None = "None"
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