import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";

export type Filter = {
  header: string;
  children?: React.ReactNode;
};

const Filter = (props: Filter) => {
  return (
    <>
      <FormControl as={SimpleGrid} columns={{ base: 4, lg: 4 }}>
        {props.children}
      </FormControl>
      <Button>Bruk</Button>
    </>
  );
};

export default Filter;

// export const Filter = (props: Filter) => {
//   return (
//     <Card>
//       <CardHeader>
//         <Heading size="md">{props.header}</Heading>
//       </CardHeader>
//       <CardBody p={2}>{props.children && props.children}</CardBody>
//     </Card>
//   );
// };
// export const FilterBody = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
//       {children}
//     </FormControl>
//   );
// };
// export type FilterSwitch = {
//   label: string;
//   callback: ({ ...args }) => void;
// };
// export const FilterSwitch = (props: FilterSwitch) => {
//   return (
//     <>
//       <FormLabel htmlFor={props.label} mb="0">
//         {props.label}
//       </FormLabel>
//       <Switch id="email-alerts" />
//     </>
//   );
// };
