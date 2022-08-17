import { NextPage } from 'next/types';
import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { usePatchUser } from '../../src/components/user/hooks/usePatchUser';
import { useUser } from '../../src/components/user/hooks/useUser';
import { UserAppointments } from '../../src/components/user/UserAppointments';
import { useRouter } from 'next/router';

const UserPage: NextPage = () => {
  const { user } = useUser();
  const patchUser = usePatchUser();
  const router = useRouter();

  if (!user) {
    router.push('/signin');
  }

  const formElements = ['name', 'address', 'phone'];
  interface FormValues {
    name: string;
    address: string;
    phone: string;
  }

  return (
    <Flex minH="84vh" align="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <UserAppointments />
        <Stack align="center">
          <Heading>Your information</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: user?.name ?? '',
              address: user?.address ?? '',
              phone: user?.phone ?? '',
            }}
            onSubmit={(values: FormValues) => {
              patchUser({ ...user, ...values });
            }}
          >
            <Form>
              {formElements.map((element) => (
                <FormControl key={element} id={element}>
                  <FormLabel>{element}</FormLabel>
                  <Field name={element} as={Input} />
                </FormControl>
              ))}
              <Button mt={6} type="submit">
                Update
              </Button>
            </Form>
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
};

export default UserPage;
