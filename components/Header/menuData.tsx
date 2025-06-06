import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  // {
  //   id: 2,
  //   title: "Features",
  //   newTab: false,
  //   path: "/#features",
  // },
  {
    id: 2.1,
    title: "Chatbot",
    newTab: false,
    path: "/chatbot",
  },
  {
    id: 3,
    title: "Features",
    newTab: false,
    submenu: [
      {
        id: 31,
        title: "Symptom analysis",
        newTab: false,
        path: "/symptoms",
      },
      {
        id: 32,
        title: "Diet planner",
        newTab: false,
        path: "/diet",
      },
      {
        id: 33,
        title: "Consult a doctor",
        newTab: false,
        path: "/docs",
      },
      {
        id: 34,
        title: "DocImage",
        newTab: false,
        path: "/image",
      },
      {
        id: 35,
        title: "DocReport",
        newTab: false,
        path: "/reports",
      },
    ],
  },
];

export default menuData;
