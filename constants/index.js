import { about, addUser, dashboard, upload, login } from "@/public/assets";
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
  cse
} from "@/public/icons";

export const navlinks = [
  {
    name: "Home",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Login",
    imgUrl: addUser,
    link: "/dashboard",
  },
  {
    name: "Quick Links",
    imgUrl: about,
    link: "/quicklinks",
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

//courses-items
export const courses = [
  {
    id: 1,
    name: "C.S.E",
    imgUrl: cse,
    link: "cse",
    description: "C.S.E branch refers to the Computer Science and Engineering (CSE) field of engineering, which focuses on the design, development, and management of computer hardware and software systems. This broad discipline involves core subjects like algorithms, data structures, programming languages, and operating systems, leading to diverse career opportunities as software engineers, data scientists, and cybersecurity analysts. "
  },
  {
    id: 2,
    name: "A.I/M.L",
    imgUrl: aiml,
    link: "aiml",
    description: "An AIML (Artificial Intelligence and Machine Learning) branch in engineering is a four-year undergraduate engineering program, often a specialization within Computer Science and Engineering, that focuses on building intelligent systems capable of human-like thinking and decision-making."
  },
  {
    id: 2,
    name: "A.I/D.S",
    imgUrl: aids,
    link: "aids",
    description: "Artificial Intelligence and Data Science (AI&DS), a specialized engineering field focused on creating intelligent systems and extracting insights from data"
  }
];

export const semester = [
  {
    id: 1,
    name: "First",
    link: "one",
    imgUrl: one,
  },
  {
    id: 2,
    name: "Second",
    link: "two",
    imgUrl: two,
  },
  {
    id: 3,
    name: "Third",
    link: "three",
    imgUrl: three,
  },
  {
    id: 4,
    name: "Fourth",
    link: "four",
    imgUrl: four,
  },
  {
    id: 5,
    name: "Fifth",
    link: "five",
    imgUrl: five,
  },
  {
    id: 6,
    name: "Sixth",
    link: "six",
    imgUrl: six,
  },
  {
    id: 7,
    name: "Seventh",
    link: "seven",
    imgUrl: seven,
  },
  {
    id: 8,
    name: "Eighth",
    link: "eight",
    imgUrl: eight,
  }
];
