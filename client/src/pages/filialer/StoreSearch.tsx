import {
  Box,
  Card,
  CardBody,
  Heading,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { type Stores } from "@prisma/client";
import { useState } from "react";
import { type Store } from "~/server/api/routers/mockData";

const StoreSearch = ({
  stores,
  selectedStoreId,
}: {
  stores: Stores[] | undefined;
  selectedStoreId: (id: string) => void;
}) => {
  const [storeInput, setInput] = useState("");
  const [filteredStores, setFilteredStores] = useState<Stores[] | undefined>(
    undefined
  );
  if (!stores) return <>Loading...</>;
  const filter = (input: string) =>
    stores.filter(
      (store) =>
        store?.city?.toLowerCase().includes(input) ||
        store.name.toLowerCase().includes(input)
    );

  const handleChange = (event: { target: { value: string } }) => {
    setInput(event.target.value);
    const input = event.target.value.toLowerCase();
    const filteredStores = input === "" ? undefined : filter(input);
    setFilteredStores(filteredStores);
  };
  return (
    <>
      <Input
        placeholder="Søk område, butikknavn.."
        value={storeInput}
        onChange={handleChange}
        autoFocus
      />
      <VStack spacing="4" w="full" mt={4}>
        {filteredStores &&
          filteredStores.map((store) => (
            <Card
              key={`${store.store_id}${store.name}`}
              w="full"
              onClick={() => selectedStoreId(store.store_id)}
              cursor="pointer"
            >
              <CardBody>
                <Box justifyContent="flex-start">
                  <Heading size="m">{store.name}</Heading>
                  <Text fontSize="xs">
                    {/* {store.city}, {store.category} */}
                    {store.city}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ))}
      </VStack>
    </>
  );
};

export default StoreSearch;
