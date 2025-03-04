import { Team, teams } from "./teams/teams.conf";
import { Challenge } from "./challenges";
import { nanoid } from "nanoid";

export type Activity = {
    id: string;
    team: Team;
    teamOpponent?: Team;
    challenge: Challenge;
    timestamp?: number;
};

class DB {
    teams: Team[];
    activities: Activity[] = [];
    challenges: Challenge[] = [];
    constructor() {
        console.log("creating new db instance");
        this.teams = teams;
    }
    static instance: DB;
    static getInstance() {
        if (!DB.instance) {
            console.log("creating new instance");
            DB.instance = new DB();
        }
        return DB.instance;
    }
    addActivity(activity: Omit<Activity, "id" | "timestamp">) {
        this.activities.push({
            ...activity,
            id: nanoid(),
            timestamp: Date.now(),
        });
        // revalidatePath('/')
    }

    getActivities() {
        return this.activities;
    }

    getTeamActivities(teamId: string) {
        return this.activities.filter((a) => a.team.id === teamId);
    }
    activateTeam(teamId: string) {
        this.teams = this.teams.map((t) => {
            if (t.id === teamId) {
                t.activated = true;
            }
            return t;
        });
        // this.challenges = this.challenges.concat({})
    }

    getPoints(teamId: string) {
        return this.activities
            .filter((a) => a.team.id === teamId)
            .reduce((acc, a) => acc + a.challenge.points, 0);
    }
    getTeamById(teamId: string) {
        return this.teams.find((t) => t.id === teamId);
    }

    getTeams() {
        return this.teams;
    }

    getActivatedTeams() {
        return this.teams
            .filter((t) => t.activated)
            .sort((a, b) => this.getPoints(b.id) - this.getPoints(a.id));
    }
}

let db: DB;

if (process.env.NODE_ENV === "production") {
    db = new DB();
} else {
    if (!global.db) {
        global.db = new DB();
    }
    db = global.db;
}

export default db;

// export const db = DB.instance ? DB.instance : DB.getInstance();
// const globalForDB = global as unknown as { db: typeof db }

// if (process.env.NODE_ENV !== 'production') globalForDB.db = db

// export default db
