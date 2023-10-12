import Link from "next/link";
import {
  FcList,
  FcShop,
  FcSportsMode,
  FcRating,
  FcSettings,
} from "react-icons/fc";

export interface Application {
  title: string;
  icon: JSX.Element;
  link: string;
  description: string;
}
export const applications: Application[] = [
  {
    title: "Filialer",
    icon: <FcShop />,
    link: "/filialer",
    description: "Velg butikk og få oversikt over topp rangert drikke på lager",
  },
  {
    title: "Ruteplanlegger",
    icon: <FcSportsMode />,
    link: "/ruteplanlegger",
    description: "Velg drikke og lag en rute",
  },
  {
    title: "Topplisten",
    icon: <FcRating />,
    link: "/topplisten",
    description: "Oversikt over best rangert øl hos vinmonopolet",
  },
  {
    title: "Instillinger",
    icon: <FcSettings />,
    link: "/settings",
    description: "Instillinger for applikasjonen",
  },
];
