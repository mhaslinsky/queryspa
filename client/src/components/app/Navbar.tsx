import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { GiFlowerPot } from 'react-icons/gi';
// import { Link as RouterLink, useHistory } from 'react-router-dom';
import Link from 'next/link';
import { useAuth } from '../../auth/useAuth';
import { useUser } from '../user/hooks/useUser';
import { useRouter } from 'next/router';

const Links = ['treatments', 'staff', 'calendar'];

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link href={to} passHref>
    <ChakraLink
      px={2}
      py={1}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        color: 'red',
      }}
    >
      {children}
    </ChakraLink>
  </Link>
);

export function Navbar(): ReactElement {
  const { user } = useUser();
  const { signout } = useAuth();
  const router = useRouter();

  return (
    <Box bg="gray" px={4}>
      <Flex h={16} alignItems="center" justify="space-between">
        <HStack spacing={8} alignItems="center">
          <NavLink to="/">
            <Icon w={8} h={8} as={GiFlowerPot} />
          </NavLink>
          <HStack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link} to={`/${link}`}>
                {link[0].toUpperCase() + link.slice(1)}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <HStack>
          {user ? (
            <>
              <NavLink to={`/user/${user.id}`}>{user.email}</NavLink>
              <Button onClick={() => signout()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => router.push('/signin')}>Sign in</Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
