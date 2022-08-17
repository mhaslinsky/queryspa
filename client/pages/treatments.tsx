import React from 'react';
import { Box, Heading, HStack } from '@chakra-ui/react';
import { useTreatments } from '../src/components/treatments/hooks/useTreatments';
import { Treatment } from '../src/components/treatments/Treatment';

const Treatments = () => {
  const treatments = useTreatments();
  return (
    <Box>
      <Heading mt={10} align="center">
        Available Treatments
      </Heading>
      <HStack m={10} spacing={8} justify="center">
        {treatments.map((treatmentData) => (
          <Treatment key={treatmentData.id} treatmentData={treatmentData} />
        ))}
      </HStack>
    </Box>
  );
};

export default Treatments;
