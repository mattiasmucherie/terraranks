// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" })
    return
  }
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res
      .status(403)
      .json({ message: "You need to login to create a tournament" })
    return
  }

  const { tournamentName, password } = req.body

  if (!tournamentName || !password) {
    res.status(400).json({ message: "Invalid request body" })
    return
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    await db.tournament.create({
      data: {
        tournamentName,
        password: hashedPassword,
      },
    })

    res.status(201).json({ message: "Tournament created successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create tournament" })
  }
}
