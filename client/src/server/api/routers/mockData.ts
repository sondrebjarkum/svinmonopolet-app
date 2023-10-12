export interface Store {
  id: number;
  name: string;
  loc: string;
  category: number;
}
const stores: Store[] = [
  {
    id: 1,
    name: "Aker Brygge",
    loc: "Oslo",
    category: 2,
  },
  {
    id: 2,
    name: "Storo",
    loc: "Oslo",
    category: 2,
  },
  {
    id: 3,
    name: "Oslo City",
    loc: "Oslo",
    category: 3,
  },
  {
    id: 4,
    name: "Bislet",
    loc: "Oslo",
    category: 2,
  },
  {
    id: 5,
    name: "Uttider",
    loc: "Bergen",
    category: 4,
  },
];

export type Beverage = {
  id: number;
  vmId: string;
  name: string;
  brewery: string;
  rating: string;
  price: string;
  alk: string;
  vol: string;
  imageUrl: string;
  unLink: string;
  vmLink: string;
  style: string;
  stock: string;
};
const beers: Beverage[] = [
  {
    id: 1,
    vmId: "11",
    name: "Fire On the Coals",
    brewery: "Jackie O's Brewery",
    rating: 4.5,
    price: 124,
    alk: "8.5",
    vol: "750",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "Porter",
  },
  {
    id: 2,
    vmId: "22",
    name: "Beer name 2",
    brewery: "Lervig",
    rating: 3.2,
    price: 124,
    alk: "8.5",
    vol: "750",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "Stout",
  },
  {
    id: 3,
    vmId: "33",
    name: "Beer name 3",
    brewery: "Nøgne Ø",
    rating: 4.55,
    price: 124,
    alk: "8.5",
    vol: "750",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "Barleywine",
  },
  {
    id: 4,
    vmId: "44",
    name: "Beer name 4",
    brewery: "Garage Beer",
    rating: 2.22,
    price: 124,
    alk: "8.5",
    vol: "750",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "Pale ale",
  },
  {
    id: 5,
    vmId: "55",
    name: "Beer name 5",
    brewery: "Nøgne Ø",
    rating: 5,
    price: 124,
    alk: "8.5",
    vol: "750",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "IPA - new england",
  },
  {
    id: 6,
    vmId: "66",
    name: "Beer name 6",
    brewery: "Omnipollo",
    rating: 3.84,
    price: 99,
    alk: "12",
    vol: "330",
    imageUrl: "",
    unLink: "",
    vmLink: "",
    style: "Kloster",
  },
];

interface Stock {
  storeId: number;
  beerId: number;
  stock: number;
}
const stock: Stock[] = [
  {
    storeId: 1,
    beerId: 1,
    stock: 12,
  },
  {
    storeId: 1,
    beerId: 2,
    stock: 9,
  },
  {
    storeId: 1,
    beerId: 3,
    stock: 22,
  },
  {
    storeId: 1,
    beerId: 4,
    stock: 1,
  },
  {
    storeId: 1,
    beerId: 5,
    stock: 24,
  },
  {
    storeId: 1,
    beerId: 6,
    stock: 4,
  },
  {
    storeId: 2,
    beerId: 1,
    stock: 12,
  },
  {
    storeId: 2,
    beerId: 2,
    stock: 9,
  },
  {
    storeId: 2,
    beerId: 3,
    stock: 22,
  },
  {
    storeId: 2,
    beerId: 4,
    stock: 2,
  },
  {
    storeId: 2,
    beerId: 6,
    stock: 4,
  },
  {
    storeId: 3,
    beerId: 3,
    stock: 22,
  },
  {
    storeId: 3,
    beerId: 4,
    stock: 1,
  },
  {
    storeId: 3,
    beerId: 5,
    stock: 24,
  },
  {
    storeId: 3,
    beerId: 6,
    stock: 4,
  },
  {
    storeId: 4,
    beerId: 6,
    stock: 12,
  },
];
const mockData = {
  stores,
  beers,
  stock,
};

export default mockData;
