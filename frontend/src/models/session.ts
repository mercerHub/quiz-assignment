interface Session {
    user?: {
        id: string;
        username: string;
        email: string;
        points: number;
        name: string;
    },
    accessToken?: string;
    refreshToken?: string;
}

export default Session;