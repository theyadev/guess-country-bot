import { MessageActionRow } from "discord.js"

interface Game {
    image_buffer: Buffer | string;
    country: string;
    row: MessageActionRow
}

const games: Map<string, Game> = new Map()

export default games