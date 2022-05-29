export enum GameTypes {
    ROCK_PAPER_SCISSOR,
    TICK_TACK_TOE
}

export enum Player {
    PLAYER_A, PLAYER_B
}

export type RoomInfo = {
    whichPLayer: Player,
    names: {
        playerA: string,
        playerB: string,
    },
    possibleGames: number[],
}