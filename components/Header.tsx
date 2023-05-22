import { Container, HStack, Text } from "@chakra-ui/react"
import { AuthComponent } from "@/components/AuthComponent"
import Link from "next/link"

export const Header = () => {
  return (
    <HStack
      as="nav"
      pos="sticky"
      top={0}
      align="center"
      justify="center"
      w="full"
      insetX={0}
      p={4}
      backdropFilter="blur(10px)"
      zIndex={999}
    >
      <Container
        alignItems="center"
        justifyContent="space-between"
        display="flex"
        maxW="container.md"
      >
        <Link href={"/"}>
          <Text>Header</Text>
        </Link>
        <AuthComponent />
      </Container>
    </HStack>
  )
}
