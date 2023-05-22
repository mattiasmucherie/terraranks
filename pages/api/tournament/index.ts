import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export type TournamentAPI = {
  id: string
  players: { image: string | null; id: string; name: string | null }[]
  tournamentName: string
  created: Date
}[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method not allowed" })
      return
    }

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res
        .status(403)
        .json({ message: "You need to login to join a tournament" })
      return
    }
    const tournaments = await db.tournament.findMany({
      where: {
        players: {
          none: {
            id: session.user.id,
          },
        },
      },
      select: {
        id: true,
        tournamentName: true,
        created: true,
        players: { select: { id: true, name: true, image: true } },
      },
    })
    const myTournaments = await db.tournament.findMany({
      where: {
        players: {
          some: {
            id: session.user.id,
          },
        },
      },
      select: {
        id: true,
        tournamentName: true,
        created: true,
        players: { select: { id: true, name: true, image: true } },
      },
    })
    res.status(200).json({ tournaments, myTournaments })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create tournament" })
  }
}
