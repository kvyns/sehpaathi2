import {
  Menu,
  X,
  BookOpen,
  Bot,
  Download,
  ChevronDown,
  BookMarked,
  Search,
  LogOut,
  Gauge,
  Plus,
  Edit2,
  Trash2,
  Link,
  File,
  Youtube,
  Code,
  Layout,
  Image,
  User,
  Settings,
  HelpCircle,
  Bell,
} from "lucide-react";

const resourceTypes = [
    { id: "bookmark", label: "Bookmark", icon: Link },

    { id: "note", label: "Note", icon: File },

    { id: "video", label: "YouTube Video", icon: Youtube },

    { id: "code", label: "Code Block", icon: Code },

    { id: "project", label: "Project", icon: Layout },

    { id: "media", label: "Media", icon: Image },

    { id: "file", label: "File", icon: File },
  ];

  const branches = [
    { id: "mme", name: "Materials"},

    { id: "CSE", name: "Computer Science Engineering" },

    { id: "it", name: "Information Technology" },

    { id: "ece", name: "Electronics & Communication" },

    { id: "ee", name: "Electrical Engineering" },

    { id: "me", name: "Mechanical Engineering" },
  ];

  const semesters = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,

    name: `Semester ${i + 1}`,
  }));

  const materialTypes = [
    "Class Notes",
    "Lecture PPTs",
    "Previous Year Questions",
    "Practical Reports",
    "Profiency Papers",
  ];

  const subjects = [
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'subject2', name: 'Physics' },
  ];

  export {resourceTypes, branches, semesters, materialTypes, subjects}