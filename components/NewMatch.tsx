import router from "next/router"
import {
  Button,
  Checkbox,
  Container,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useCheckbox,
} from "@chakra-ui/react"
import React, { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Corporation, User } from "@prisma/client"

export const NewMatch = () => {
  const [newMatch, setNewMatch] = useState<
    { id: string; player: User; vp: number; corporation: string }[]
  >([])
  const { id } = router.query
  const {} = useCheckbox()

  const { data } = useSWR<{
    tournamentPlayers: {
      players: User[]
    } | null
  }>(`/api/tournament/players/${id}`, fetcher)
  const { data: corporations } = useSWR<{ corporations: Corporation[] }>(
    `/api/corporations`,
    fetcher
  )

  const handleCheckboxClick = (value: boolean, player: User) => {
    if (value) {
      setNewMatch((prev) => [
        ...prev.filter((p) => p.id !== player.id),
        { id: player.id, player, vp: 0, corporation: "" },
      ])
    } else {
      setNewMatch((prev) => [...prev.filter((p) => p.id !== player.id)])
    }
  }
  console.warn(newMatch)

  const handleNumberChange = (value: string, playerId: string) => {
    setNewMatch((prevNewMatch) =>
      prevNewMatch.map((match) =>
        match.player.id === playerId ? { ...match, vp: Number(value) } : match
      )
    )
  }

  const handleCorporationChange = (value: string, playerId: string) => {
    setNewMatch((prevNewMatch) =>
      prevNewMatch.map((match) =>
        match.player.id === playerId ? { ...match, corporation: value } : match
      )
    )
  }

  const corporationAlreadyUsed = (corpId: string) =>
    !!newMatch.find((p) => p.corporation === corpId)

  const handleSubmitMatch = async () => {
    await fetch("/api/match/new", {
      method: "PUT",
      body: JSON.stringify({ newMatch, tournamentId: id }),
    })
    console.log("Done!")
  }

  if (!data?.tournamentPlayers || !corporations) {
    return <div>No players</div>
  }
  return (
    <div>
      New Match
      <Container>
        <Tabs>
          <TabList>
            <Tab>Players</Tab>
            <Tab>Stats</Tab>
            <Tab>Review</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ul>
                {data.tournamentPlayers.players.map((tp) => {
                  return (
                    <li key={tp.id}>
                      <Checkbox
                        onChange={(e) =>
                          handleCheckboxClick(e.target.checked, tp)
                        }
                      >
                        {tp.name}
                      </Checkbox>
                    </li>
                  )
                })}
              </ul>
            </TabPanel>
            <TabPanel>
              <ul>
                {newMatch.map((p) => {
                  return (
                    <li key={p.id}>
                      <p>{p.player.name}</p>
                      <NumberInput
                        defaultValue={0}
                        min={0}
                        allowMouseWheel
                        onChange={(e) => handleNumberChange(e, p.id)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Select
                        onChange={(e) =>
                          handleCorporationChange(e.target.value, p.id)
                        }
                      >
                        {corporations.corporations.map((c) => {
                          return (
                            <option
                              disabled={corporationAlreadyUsed(c.id)}
                              key={c.id}
                              value={c.id}
                            >
                              {c.name}
                            </option>
                          )
                        })}
                      </Select>
                    </li>
                  )
                })}
              </ul>
            </TabPanel>
            <TabPanel>
              <ul>
                {newMatch.map((p) => {
                  return (
                    <li key={p.id}>
                      {p.player.name} - VP: {p.vp} - Corporation:{" "}
                      {p.corporation}
                    </li>
                  )
                })}
              </ul>
              <Button onClick={handleSubmitMatch}>Submit Match</Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </div>
  )
}
