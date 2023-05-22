import { TournamentAPI } from "@/pages/api/tournament"
import { ChangeEvent, FC, FormEvent, useState } from "react"
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import { useSWRConfig } from "swr"
import Link from "next/link"

type TournamentCardProps = {
  tournaments: TournamentAPI
  title: string
  isJoinable?: boolean
}

const TCard = ({
  t,
  isJoinable,
}: {
  t: TournamentAPI[0]
  isJoinable?: boolean
}) => {
  const { mutate } = useSWRConfig()

  const [value, setValue] = useState("")

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await fetch("/api/tournament/join", {
        method: "PUT",
        body: JSON.stringify({ tournamentId: t.id, password: value }),
      })
      setValue("")

      await mutate("/api/tournament")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card maxW="sm">
      <CardHeader>
        <Link href={`/tournament/${t.id}`}>
          <Heading as="h5" size="md" noOfLines={1}>
            {t.tournamentName}
          </Heading>
        </Link>
        {isJoinable && (
          <form onSubmit={handleSubmit}>
            <Flex flexDirection="column" gap={4}>
              <Text>{t.tournamentName}</Text>
              <Input
                value={value}
                onChange={handleChange}
                type="password"
                placeholder="password"
                size="sm"
              />
              <Button colorScheme="blue" type="submit" mr={3}>
                Join
              </Button>
            </Flex>
          </form>
        )}
        <AvatarGroup size={"md"} max={2}>
          {t?.players.map((p) => {
            return <Avatar key={p.id} name={p.name!} src={p.image!}></Avatar>
          })}
        </AvatarGroup>
      </CardHeader>
    </Card>
  )
}
export const TournamentCard: FC<TournamentCardProps> = ({
  tournaments,
  title,
  isJoinable,
}) => {
  return (
    <Container>
      <Heading>{title}</Heading>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {tournaments.map((t) => {
          return <TCard key={t.id} t={t} isJoinable={isJoinable} />
        })}
      </SimpleGrid>
    </Container>
  )
}
