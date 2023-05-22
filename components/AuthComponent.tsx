import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react"

export const AuthComponent = () => {
  const { data: session } = useSession()
  if (session && session.user) {
    return (
      <Flex alignItems="center" gap={2}>
        <Avatar
          alignSelf="center"
          objectFit="cover"
          src={session.user!.image!}
          h={8}
          w={8}
          name={session.user!.name!}
        />
        <Text>{session.user.name}</Text>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
      </Flex>
    )
  }
  return (
    <Flex alignItems="center" gap={2}>
      <Button onClick={() => signIn("google")}>Sign in</Button>
    </Flex>
  )
}
