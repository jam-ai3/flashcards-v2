export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  subscriptionStart: number | null;
  subscriptionEnd: number | null;
  paidGenerates: number;
  freeGenerates: number;
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

export type PaymentType = "subscription" | "free" | "single";

export type Product = {
  id: string;
  name: string;
  description: string;
  priceInPennies: number;
  isSubscription: boolean;
};

export type Session = {
  userId: string;
};

declare module "express-serve-static-core" {
  interface Request {
    session: Session;
  }
}
