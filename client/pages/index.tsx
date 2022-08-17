import { Icon, Stack, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { GiFlowerPot } from 'react-icons/gi';
import React from 'react';
import { BackgroundImage } from '../src/components/common/BackgroundImage';

const Home: NextPage = () => {
  return (
    <Stack align="center" justify="center" height="84vh">
      <BackgroundImage />
      <Text textAlign="center" fontFamily="Forum, sans-serif" fontSize="6em">
        <Icon m={4} verticalAlign="top" as={GiFlowerPot} />
        Lazy Days Spa
      </Text>
      <Text>Hours: limited</Text>
      <Text>Address: nearby</Text>
    </Stack>
  );
};

export default Home;
