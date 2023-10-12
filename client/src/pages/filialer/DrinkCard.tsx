import {
  Card,
  CardBody,
  Heading,
  Box,
  Text,
  HStack,
  Image,
  Button,
  Stack,
  IconButton,
  Flex,
  VStack,
  Divider,
  Center,
} from "@chakra-ui/react";
import { SiUntappd } from "react-icons/si";
import { AiOutlineStar } from "react-icons/ai";
import { BsCartDashFill, BsCartPlusFill } from "react-icons/bs";
import { useAppStore } from "~/store/store";
import { type Product } from "~/store/slices/createCartSlice";
type ExtraProps = {
  showStoreInfo?: boolean;
};
type DrinkCard = Product & ExtraProps;

const DrinkCard = (props: DrinkCard) => {
  const { addToCart, removeFromCart, cart } = useAppStore();

  return (
    <Card key={`${props.beverage.vmp_id}`} w="full">
      <CardBody p={2}>
        {props.showStoreInfo && (
          <Box borderRadius={5} p={1} mb={2} w={"full"} bg={"gray.100"}>
            <Text fontSize={"xs"} fontWeight={"bold"}>
              🏪 {props.store.name}
            </Text>
          </Box>
        )}

        <HStack justifyContent={"space-between"}>
          {/* General information */}
          <HStack>
            <Box boxSize="55px" minW={"55px"}>
              <Image
                src={props.beverage.untappd_image ?? "badge-beer-default.png"}
                alt="beverage"
                // borderRadius={"full"}
              />
            </Box>
            <Box justifyContent="flex-start">
              <Text fontSize="xs" fontWeight={"bold"} lineHeight={1}>
                {props.beverage.untappd_name}
              </Text>
              <Text fontSize="xs">
                {props.beverage.untappd_brewery?.includes("BALADIN")
                  ? "Baladin"
                  : props.beverage.untappd_brewery}
              </Text>
              <Text fontSize="xs">{props.beverage.style}</Text>
              {/* Links */}
              <Stack direction="row" spacing={2} mt={2}>
                <IconButton
                  size={"xs"}
                  minW={"40px"}
                  h={"20px"}
                  icon={<SiUntappd />}
                  colorScheme="yellow"
                  variant="solid"
                  aria-label={"Untappd link"}
                  onClick={() =>
                    window.open(props.beverage.untappd_link as string, "_blank")
                  }
                ></IconButton>
                <Button
                  h={"20px"}
                  size={"xs"}
                  minW={"40px"}
                  colorScheme="gray"
                  variant="solid"
                  onClick={() =>
                    window.open(props.beverage.vmp_link as string, "_blank")
                  }
                >
                  VM
                </Button>
              </Stack>
            </Box>
          </HStack>
          {/* Depth information */}

          <HStack minW={"85px"}>
            <Center height={"90px"}>
              <Divider orientation="vertical" />
            </Center>
            <VStack alignItems={"center"} gap={0} minW={"85px"}>
              {/* Rating */}
              <Flex alignItems={"center"}>
                <AiOutlineStar />
                <Heading size="xs" lineHeight={1}>
                  {props.beverage.untappd_rating == "0"
                    ? "unrated"
                    : props.beverage.untappd_rating}
                </Heading>
              </Flex>
              {/* ABV and volume */}
              <Flex gap={2}>
                <Text fontWeight={"bold"} lineHeight={1} fontSize={"xs"}>
                  {props.beverage.abv}%
                </Text>
                <Text fontWeight={"bold"} lineHeight={1} fontSize={"xs"}>
                  {props.beverage?.volume.split(".")[0]}cl
                </Text>
              </Flex>
              {/* Price and stock */}
              <Flex gap={2}>
                <Text fontWeight={"bold"} lineHeight={1} fontSize={"xs"}>
                  {props.beverage.price}kr
                </Text>
                <Text fontWeight={"bold"} lineHeight={1} fontSize={"xs"}>
                  {props.stock.quantity}📦 {/* FIXME: use actual stock */}
                </Text>
              </Flex>
              {/* Add to cart */}
              <Box w={"full"}>
                {cart.some(
                  (e) => e.beverage.vmp_id === props.beverage.vmp_id
                ) ? (
                  <IconButton
                    icon={<BsCartDashFill />}
                    size={"xs"}
                    w={"full"}
                    aria-label={""}
                    colorScheme={"red"}
                    h={"20px"}
                    onClick={() => {
                      removeFromCart(props.beverage.vmp_id);
                      console.log(cart);
                    }}
                    disabled={false}
                  ></IconButton>
                ) : (
                  <IconButton
                    icon={<BsCartPlusFill />}
                    size={"xs"}
                    w={"full"}
                    aria-label={""}
                    colorScheme={"whatsapp"}
                    h={"20px"}
                    onClick={() => {
                      addToCart({ ...props });
                      console.log(cart);
                    }}
                    disabled={false}
                  ></IconButton>
                )}
              </Box>
            </VStack>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};
export default DrinkCard;

{
  /* <hr style={{ width: "100%" }} />
<VStack>
  <Flex>
    <AiOutlineStar />
    <Heading size="xs" lineHeight={1}>
      {props.rating}
    </Heading>
  </Flex>
</VStack>
</VStack> */
}
