import { about, addUser, dashboard, upload, login, punya, favourite, quicklinks } from "@/public/assets";
import {
  important,
  qp,
  study,
  syllabus,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  aids,
  aiml,
  cse,
  books
} from "@/public/icons";

export const navlinks = [
  {
    name: "Home",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Hall of Punya",
    imgUrl: punya,
    link: "/hallofpunya",
  },
  {
    name: "Login",
    imgUrl: addUser,
    link: "/dashboard",
  },
  {
    name: "Quick Links",
    imgUrl: quicklinks,
    link: "/quicklinks",
  },
  {
    name: "Favourites",
    imgUrl: favourite,
    link: "/favourites",
  }
];

//category-items
export const category = [
  {
    id: 1,
    name: "Study Materials",
    imgUrl: study,
    link: "notes",
    description: "Study Materials",
  },
  {
    id: 2,
    name: "Syllabus",
    imgUrl: syllabus,
    link: "syllabus",
    description: "Syllabus",
  },
  {
    id: 3,
    name: "Question Papers",
    imgUrl: qp,
    link: "questionpapers",
    description: "Question Papers",
  },
  {
    id: 4,
    name: "QuickNotes",
    imgUrl: important,
    link: "quicknotes",
    description: "videos lesson",
  },
];


// semesters-items
export const semester = [
  {
    id: 1,
    name: "1",
    link: "1",
    imgUrl: one,
  },
  {
    id: 2,
    name: "2",
    link: "2",
    imgUrl: two,
  },
  {
    id: 3,
    name: "3",
    link: "3",
    imgUrl: three,
  },
  {
    id: 4,
    name: "4",
    link: "4",
    imgUrl: four,
  },
  {
    id: 5,
    name: "5",
    link: "5",
    imgUrl: five,
  },
  {
    id: 6,
    name: "6",
    link: "6",
    imgUrl: six,
  },
  {
    id: 7,
    name: "7",
    link: "7",
    imgUrl: seven,
  },
  {
    id: 8,
    name: "8",
    link: "8",
    imgUrl: eight,
  }
];

// Semester count options for admin configuration
export const semesterCounts = [
  { value: 4, label: "4 Semesters" },
  { value: 6, label: "6 Semesters" },
  { value: 8, label: "8 Semesters" }
];
