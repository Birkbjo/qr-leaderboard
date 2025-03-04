export type Challenge = {
    id: string;
    title: string;
    description?: string;
    versus?: boolean;
    points: number;
}

export const SIGNUP_CHALLENGE: Challenge = {
    id: 'KEl35bp9P',
    title: 'Signup',
    points: 100,
}

export const challenges = [{
    id: 'KElV5bp9P',
    title: 'Beerpong',
    versus: true,
    points: 500,
}, {
    id: 'M6o8patU_',
    title: 'Quiz',
    points: 500,
},
{
    id: 'W8_n7lTNG',
    title: 'Mario Kart',
    points: 500,
    versus: true
}, {
    id: 'L_TDa3jII',
    title: 'Bonus Treasure',
    points: 100,
},
{
    id: 'SckWcxmoZ',
    title: 'Bonus Treasure',
    points: 100,
},
{
    id: 'Tn7-XA13Z',
    title: 'Bonus Treasure',
    points: 100,
}]