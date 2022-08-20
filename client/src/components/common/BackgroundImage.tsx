import { Img } from '@chakra-ui/react';
import { ReactElement } from 'react';

export function BackgroundImage(): ReactElement {
  return (
    <Img
      minHeight="100%"
      minWidth="1024px"
      width="100%"
      height="auto"
      position="fixed"
      top="0"
      left="0"
      zIndex="-1"
      src="/splash.jpg"
      alt="peaceful orchids and stacked rocks"
    />
  );
}
