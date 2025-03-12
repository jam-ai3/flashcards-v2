export type User = {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: number;
  updatedAt: number;
  subscriptionStart: number | null;
  subscriptionEnd: number | null;
  paidGenerates: number;
};

export type GenerateResponse = {
  flashcards: RawFlashcard[];
  type: "subscription" | "free" | "single" | null;
};

export type RawFlashcard = {
  front: string;
  back: string;
};

export type CourseInfo = {
  university: string;
  department: string;
  courseNumber: string;
  courseName: string;
};

export type GenerateType = "syllabus" | "notes" | "courseInfo";

export type InputFormat = "text" | "pdf" | "pptx";

export type GenerateFlashcardsArgs = {
  type: GenerateType;
  inputFormat: InputFormat;
  text?: string;
  pptx?: File;
  pdf?: File;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  priceInPennies: number;
  url: string;
};
