import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FcPaid } from "react-icons/fc";
import { FiGrid } from "react-icons/fi";
import { BsCart2 } from "react-icons/bs";

import { applications } from "./applications";
import Link from "next/link";
import { useAppStore } from "~/store/store";
import { Popup } from "~/pages/filialer";
import DrinkCard from "~/pages/filialer/DrinkCard";

const Header = () => {
  const { toggleCart, showCart } = useAppStore();
  const { onOpen, onClose } = useDisclosure();
  const CartContent = () => {
    const { cart } = useAppStore();
    return (
      <VStack>
        {cart &&
          cart.map((item) => (
            <DrinkCard key={item.beverage.name} {...item} showStoreInfo />
          ))}
      </VStack>
    );
  };
  return (
    <>
      <Flex justifyContent="space-between" mt="2" mb="2">
        <Center>
          <Heading size="m">
            <Link href="/">SvinMonopolet</Link>
          </Heading>
        </Center>
        <HStack>
          <Menu>
            <MenuButton as={IconButton} icon={<FiGrid />}></MenuButton>
            <MenuList>
              {applications.map((app) => (
                <Link href={app.link} key={app.title}>
                  <MenuItem icon={app.icon} key={app.title}>
                    {app.title}
                  </MenuItem>
                </Link>
              ))}
            </MenuList>
          </Menu>
          <IconButton
            aria-label="Basket"
            onClick={toggleCart}
            icon={<BsCart2 size="1.2em" />}
          />
        </HStack>
      </Flex>
      <hr></hr>

      <Popup
        isOpen={showCart}
        onClose={toggleCart}
        onOpen={onOpen}
        content={<CartContent />}
        header="Handlelisten 💸"
      />
    </>
  );
};

export default Header;
