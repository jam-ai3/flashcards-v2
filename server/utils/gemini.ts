import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { CourseInfo, GenerateType, RawFlashcard } from "../types";
import { v4 } from "uuid";
import { GEMINI_API_KEY } from "./constants";
config();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const gemini = {
  generate: async (
    generateType: GenerateType,
    text?: string
  ): Promise<RawFlashcard[]> => {
    if (text === undefined || text === "") {
      return [];
    }
    let res: RawFlashcard[] = [];
    switch (generateType) {
      case "notes":
        res = await generateFlashcardsFromNotes(text);
        break;
      case "syllabus":
        res = await generateFlashcardsFromSyllabus(text);
        break;
      case "courseInfo":
        const courseInfo = JSON.parse(text) as CourseInfo;
        if (!courseInfo) {
          return [];
        }
        res = await generateFlashcardsFromCourseInfo(
          courseInfo.university,
          courseInfo.department,
          courseInfo.courseNumber,
          courseInfo.courseName
        );
    }
    return res.map((c) => {
      return { ...c, id: v4() };
    });
  },
};

const syllabusPrompt = `
        I'm going to send you a course syllabus.
        I'd like you to generate flashcards to teach the course material.
        Please respond in the following json format: [{ front: string, back: string }].
        Your response string should not include any markdown formatting.
        Please be sure to generate flashcards related to the course content, not the course syllabus.
        You will need to use external resources and hypothesize the specifics of the course.
        
        Course Syllabus:
        
        `;

async function generateFlashcardsFromSyllabus(
  syllabus: string
): Promise<RawFlashcard[]> {
  try {
    const result = await model.generateContent(syllabusPrompt + syllabus);
    const output = removeFormatting(result.response.text());
    const json = JSON.parse(output);
    return json as RawFlashcard[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const notesPrompt = `
        I'm going to send you my notes from a course.
        I'd like you to generate flashcards to teach the course material.
        Please respond in the following json format: [{ front: string, back: string }].
        Your response string should not include any markdown formatting.
        
        Notes:
        
        `;

async function generateFlashcardsFromNotes(
  notes: string
): Promise<RawFlashcard[]> {
  try {
    const result = await model.generateContent(notesPrompt + notes);
    const output = removeFormatting(result.response.text());
    const json = JSON.parse(output);
    return json as RawFlashcard[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const courseInfoPrompt = (
  university: string,
  department: string,
  courseNumber: string,
  courseName: string
) => `
  I'm going to give you some information about a course.
  I'd like you to generate flashcards to teach the course material.
  Please respond in the following json format: [{ front: string, back: string }].
  Your response string should not include any markdown formatting.
  Please be sure to generate flashcards related to the course content, not the course information.
  Please do not repeat yourself or generate any additional text. Only one JSON array of flashcard objects.
  You will need to use external resources and hypothesize the specifics of the course.
  University: ${university},
  Department: ${department},
  Course Number: ${courseNumber},
  Course Name: ${courseName}
`;

async function generateFlashcardsFromCourseInfo(
  university: string,
  department: string,
  courseNumber: string,
  courseName: string
): Promise<RawFlashcard[]> {
  try {
    const result = await model.generateContent(
      courseInfoPrompt(university, department, courseNumber, courseName)
    );
    const output = removeFormatting(result.response.text());
    const json = JSON.parse(output);
    return json as RawFlashcard[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function removeFormatting(input: string) {
  return input.slice(8, input.length - 3);
}
