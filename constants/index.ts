import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const salutations = [
  { value: "Mr.", name: "Mr." },
  { value: "Mrs.", name: "Mrs." },
  { value: "Ms.", name: "Ms." },
  { value: "Dr.", name: "Dr." },
  { value: "Prof.", name: "Prof." },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgUrl: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgUrl: "/assets/icons/star.svg",
    route: "/saved-posts",
    label: "Saved Posts",
  },
  {
    imgUrl: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgUrl: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgUrl: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgUrl: "/assets/icons/add-circle.svg",
    route: "/create-post",
    label: "New Post",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
