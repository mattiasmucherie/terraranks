import { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/db"

export interface Root {
  newMatch: NewMatch[]
  tournamentId: string
}

export interface NewMatch {
  id: string
  player: Player
  vp: number
  corporation: string
}

export interface Player {
  id: string
  name: string
  email: string
  emailVerified: any
  image: string
  playerRating: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { newMatch, tournamentId } = JSON.parse(req.body) as Root

    console.log(newMatch, tournamentId)

    const arrayOfPlayers = newMatch.map((p) => p.id)
    const playersWithTournamentRating = await db.tournamentRating.findMany({
      where: {
        playerId: {
          in: arrayOfPlayers,
        },
      },
    })
    console.log(playersWithTournamentRating)
    // const match = await db.match.create({
    //   data: {
    //     tournamentId,
    //     matchPlayers: {
    //       createMany: { data: newMatch.map((p) => ({ playerId: p.id })) },
    //     },
    //     ratingHistories:{

    //     }
    //   },
    // })
    // Create a new match and associated matchPlayers and matchResults in the database
    // const newMatch = await db.match.create({
    //   data: {
    //     tournamentId,
    //     matchPlayers: {
    //       create: matchPlayers.map((player) => ({
    //         playerId: player.id,
    //       })),
    //     },
    //     matchResults: {
    //       create: matchResults.map((result) => ({
    //         playerId: result.playerId,
    //         position: result.position,
    //       })),
    //     },
    //   },
    // })

    res.status(200).json({ message: "ok!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create match" })
  }
}
