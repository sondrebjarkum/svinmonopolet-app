import {
  Button,
  Container,
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";
import DrinkCard from "./DrinkCard";
import StoreSearch from "./StoreSearch";
import { HiSwitchHorizontal } from "react-icons/hi";
import Filters from "./Filters";
import { type Stores } from "@prisma/client";
import InfiniteScroll from "react-infinite-scroll-component";

const Beers = ({ store }: { store: Stores }) => {
  const stock = api.stock.get.useQuery({
    storeId: store.store_id,
  });

  const [page, setPage] = useState(1);

  const content =
    !stock.isLoading &&
    stock.data &&
    stock.data.map((stock) => {
      return (
        <DrinkCard
          key={stock.beer.untappd_name}
          beverage={stock.beer}
          stock={stock}
          store={store}
        />
      );
    });
    // <InfiniteScroll
    //   dataLength={stock.data.length}
    //   next={() => setPage(page + 1)}
    //   hasMore={true}
    // >
    //   {stock.data.map((stock) => {
    //     return (
    //       <DrinkCard
    //         key={stock.beer.untappd_name}
    //         beverage={stock.beer}
    //         stock={stock}
    //         store={store}
    //       />
    //     );
    //   })}
    // </InfiniteScroll>

  if (content && content.length < 1 && !stock.isLoading)
    return <p>Fant ingenting på lager</p>;
  return <>{content}</>;
};
const popupHeaders = {
  FILIAL: "Velg filial",
  FILTERS: "Filter",
} as const;

export default function Filialer() {
  const data = api.stores.getAll.useQuery();
  const [stores, setStores] = useState<Stores[]>([]);

  const [store, setStore] = useState<Stores | undefined>(undefined);
  const [headingText, setHeadingText] = useState("Ingen filial valgt");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [popupContent, setPopupContent] = useState(<></>);
  const [popupHeader, setPopupHeader] = useState<string>(popupHeaders.FILIAL);

  const handleOpenPopup = (type: string) => {
    // content: { header: string; body: JSX.Element }
    setPopupContent(
      type === "stores" ? (
        <StoreSearch
          stores={stores}
          selectedStoreId={(store_id: string) => {
            setStore(
              () => stores && stores.find((e) => e.store_id === store_id)
            );
            onClose();
          }}
        />
      ) : (
        <Filters></Filters>
      )
    );
    setPopupHeader(
      type === "stores" ? popupHeaders.FILIAL : popupHeaders.FILTERS
    );
    onOpen();
  };

  useEffect(() => {
    if (data.data) {
      setStores(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (store) {
      setHeadingText(store.name);
    }
  }, [store]);

  useEffect(() => {
    if (stores && !store) {
      setTimeout(() => {
        handleOpenPopup("stores");
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores]);

  return (
    <>
      <Header></Header>

      <Container centerContent mt="4" w="full" p={0}>
        <HStack mb={4} alignItems={"center"}>
          <Heading size="m">{headingText}</Heading>
          {store && (
            <IconButton
              icon={<HiSwitchHorizontal />}
              aria-label=""
              onClick={() => handleOpenPopup("stores")}
              variant={"outline"}
              size={"sm"}
              maxHeight={"25px"}
            />
          )}
        </HStack>
        <HStack align={"stretch"}>
          {store && (
            <Button size={"sm"} onClick={() => handleOpenPopup("filter")}>
              Filter
            </Button>
          )}
          {!store && (
            <Button onClick={() => handleOpenPopup("stores")}>
              Velg filial
            </Button>
          )}
        </HStack>
        <VStack spacing="4" w="full" mt={4}>
          {store && <Beers store={store} />}
        </VStack>
      </Container>
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        // content={!store ? storeSearchContent : filtersContent}
        content={popupContent}
        header={popupHeader}
      />
    </>
  );
}

interface Popup {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  content: JSX.Element;
  header: string;
}
export const Popup = ({ isOpen, onOpen, onClose, content, header }: Popup) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="full" placement="bottom">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <Container maxW="2xl">
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerBody>{content}</DrawerBody>
        </Container>
      </DrawerContent>
    </Drawer>
  );
};
