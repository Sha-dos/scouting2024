export interface Data {
    matches: {
        matchNumber: number,
        teams: TeamMatchData[]
    }[]
}

export interface TeamMatchData {
    teamNumber: number,
    matchNumber: number,
    alliance: Alliance,
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
    Exceptional = "Exceptional",
    DidNotPlay = "No Defense"
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
    Red = "Red",
    Blue = "Blue"
}

export enum AppState {
    PreMatch,
    Auto,
    Teleop,
    PostMatch
}

export enum Station {
    Red1 = "Red 1",
    Red2 = "Red 2",
    Red3 = "Red 3",
    Blue1 = "Blue 1",
    Blue2 = "Blue 2",
    Blue3 = "Blue 3"
}

export const parseFirebaseData = (data: any): TeamMatchData[] => {
    const matches: TeamMatchData[] = [];
    for (const matchId in data) {
        const matchData = data[matchId];
        const teams = matchData.teams;
        for (const teamNumber in teams) {
            // Parse the team data.
            const teamData = teams[teamNumber];
            const match: TeamMatchData = {
                teamNumber: parseInt(teamNumber),
                matchNumber: parseInt(matchId),
                alliance: parseAlliance(teamData.alliance),
                humanPlayerAmp: teamData.humanPlayerAmp,
                autoNotesAttempted: parseAutoNotesAttempted(teamData.autoNotesAttempted),
                autoNotesCollected: parseAutoNotesCollected(teamData.autoNotesCollected),
                autoPark: teamData.autoPark,
                notesAttempted: parseNotesAttempted(teamData.notesAttempted),
                park: parsePark(teamData.park),
                ampPlayed: parseAmpPlayed(teamData.ampPlayed),
                microphone: parseMicrophoneShot(teamData.microphone),
                climb: parseClimb(teamData.climb),
                trap: teamData.trap,
                amplify: teamData.amplify,
                defense: teamData.defense,
                pickupLocation: parsePickupLocation(teamData.pickupLocation),
                defenseScale: parseDefenseScale(teamData.defenseScale),
                comments: teamData.comments || ""
            };
            matches.push(match);
        }
    }
    return matches;
};

const parseAutoNotesAttempted = (notes: any[] | undefined): NoteShot[] => {
    if (!notes) { return []; }

    return notes.map(note => ({
        time: note.time,
        made: false,
        locationShot: parseFieldLocation(note.locationShot),
        locationScored: parseScoreLocation(note.locationScored)
    }));
};

const parseAutoNotesCollected = (notes: any[] | undefined): AutoNoteCollected[] => {
    if (!notes) { return []; }

    return notes.map(note => ({
        time: note.time,
        location: parseAutoNote(note.location)
    }));
};

const parseAutoNote = (location: string): AutoNote => {
    switch (location) {
        case "Close0":
            return AutoNote.Close0;
        case "Close1":
            return AutoNote.Close1;
        case "Close2":
            return AutoNote.Close2;
        case "Mid0":
            return AutoNote.Mid0;
        case "Mid1":
            return AutoNote.Mid1;
        case "Mid2":
            return AutoNote.Mid2;
        case "Mid3":
            return AutoNote.Mid3;
        case "Mid4":
            return AutoNote.Mid4;
        default:
            throw new Error("Invalid auto note location: " + location);
    }
};

const parseNotesAttempted = (notes: any[] | undefined): NoteShot[] => {
    if (!notes) { return []; }

    return notes.map(note => ({
        time: note.time,
        made: note.made,
        locationShot: parseFieldLocation(note.locationShot),
        locationScored: parseScoreLocation(note.locationScored)
    }));
};

const parseFieldLocation = (location: any): FieldLocation => {
    if (!location) { return {x: 0, y: 0, distance: 0, angle: 0}; }

    return {
        x: location.x,
        y: location.y,
        distance: location.distance,
        angle: location.angle
    };
};

const parseScoreLocation = (location: string): ScoreLocation => {
    switch (location) {
        case "Speaker":
            return ScoreLocation.Speaker;
        case "Amp":
            return ScoreLocation.Amp;
        case "Trap":
            return ScoreLocation.Trap;
        default:
            throw new Error("Invalid score location: " + location);
    }
};

const parsePark = (park: string): Park => {
    switch (park) {
        case "Dangerous":
            return Park.Dangerous;
        case "Good":
            return Park.Good;
        case "Failed":
            return Park.Failed;
        case "None":
            return Park.None;
        default:
            throw new Error("Invalid park: " + park);
    }
};

const parseAmpPlayed = (ampPlayed: string | undefined): AmpPlayed => {
    if (!ampPlayed) { return AmpPlayed.None; }

    switch (ampPlayed) {
        case "Send":
            return AmpPlayed.Send;
        case "Accept":
            return AmpPlayed.Accept;
        case "Reject":
            return AmpPlayed.Reject;
        case "None":
            return AmpPlayed.None;
        default:
            throw new Error("Invalid amp played: " + ampPlayed);
    }
};

const parseMicrophoneShot = (microphone: string | undefined): MicrophoneShot => {
    if (!microphone) { return MicrophoneShot.DidNotAttempt; }

    switch (microphone) {
        case "None":
            return MicrophoneShot.DidNotAttempt;
        case "Failed":
            return MicrophoneShot.Failed;
        case "First":
            return MicrophoneShot.First;
        case "Second":
            return MicrophoneShot.Second;
        case "Third":
            return MicrophoneShot.Third;
        default:
            throw new Error("Invalid microphone shot: " + microphone);
    }
};

const parseClimb = (climb: string | undefined): Climb => {
    if (!climb) { return Climb.None; }

    switch (climb) {
        case "Failed":
            return Climb.Failed;
        case "Solo":
            return Climb.Solo;
        case "Double":
            return Climb.Double;
        case "Triple":
            return Climb.Triple;
        case "None":
            return Climb.None;
        default:
            throw new Error("Invalid climb: " + climb);
    }
};

const parsePickupLocation = (pickupLocation: string | undefined): PickupLocation => {
    if (!pickupLocation) { return PickupLocation.None; }

    switch (pickupLocation) {
        case "None":
            return PickupLocation.None;
        case "Floor":
            return PickupLocation.Floor;
        case "Human Player":
            return PickupLocation.HumanPlayer;
        case "Both":
            return PickupLocation.Both;
        default:
            throw new Error("Invalid pickup location: " + pickupLocation);
    }
};

const parseDefenseScale = (defenseScale: string | undefined): DefenseRange => {
    if (!defenseScale) { return DefenseRange.DidNotPlay; }

    switch (defenseScale) {
        case "0":
            return DefenseRange.Bad;
        case "1":
            return DefenseRange.Okay;
        case "2":
            return DefenseRange.Average;
        case "3":
            return DefenseRange.Good;
        case "4":
            return DefenseRange.Exceptional;
        default:
            return DefenseRange.DidNotPlay
    }
};

const parseAlliance = (alliance: string | undefined): Alliance => {
    switch (alliance) {
        case "Red":
            return Alliance.Red
        case "Blue":
            return Alliance.Blue
        default:
            return Alliance.Red
    }
}