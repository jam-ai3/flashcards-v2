"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useState } from "react";
import { handleGenerate } from "../_actions/generate";
import { Error } from "@/lib/utils";
import { InputFormat, InputType } from "@/lib/types";

type GenerateError = {
  format?: string[];
  notesText?: string[];
  notesPdf?: string[];
  notesPptx?: string[];
  syllabusText?: string[];
  syllabusPdf?: string[];
  syllabusPptx?: string[];
  university?: string[];
  department?: string[];
  courseNumber?: string[];
  courseName?: string[];
  error?: string;
};

type GenerateFormProps = {
  userId: string;
};

export default function GenerateForm({ userId }: GenerateFormProps) {
  const [inputType, setInputType] = useState<InputType>("courseInfo");
  const [error, action] = useActionState(
    handleGenerate.bind(null, userId, inputType),
    {}
  );

  function renderInput() {
    switch (inputType) {
      case "notes":
        return <NotesInput error={error} />;
      case "syllabus":
        return <SyllabusInput error={error} />;
      case "courseInfo":
        return <CourseInfoInput error={error} />;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Information</span>
          <div className="flex gap-2">
            <Button
              variant={inputType === "notes" ? "default" : "outline"}
              onClick={() => setInputType("notes")}
            >
              Notes
            </Button>
            <Button
              variant={inputType === "syllabus" ? "default" : "outline"}
              onClick={() => setInputType("syllabus")}
            >
              Syllabus
            </Button>
            <Button
              variant={inputType === "courseInfo" ? "default" : "outline"}
              onClick={() => setInputType("courseInfo")}
            >
              Course Info
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error commodi
          facere voluptatum libero aperiam delectus sunt, possimus repudiandae
          alias recusandae?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-2">
          {renderInput()}
          <Button type="submit" className="mt-6">
            Generate
          </Button>
          {(error as Error).error && (
            <p className="text-destructive">{(error as Error).error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

type InputProps = {
  error: GenerateError;
};

function NotesInput({ error }: InputProps) {
  const [format, setFormat] = useState<InputFormat>("text");

  function renderInput() {
    switch (format) {
      case "text":
        return (
          <>
            <Textarea name="notesText" id="notesText" required />
            {error.notesText && (
              <p className="text-destructive">{error.notesText}</p>
            )}
          </>
        );
      case "pdf":
        return (
          <>
            <Input
              type="file"
              name="notesPdf"
              id="notesPdf"
              accept=".pdf"
              required
            />
            {error.notesPdf && (
              <p className="text-destructive">{error.notesPdf}</p>
            )}
          </>
        );
      case "pptx":
        return (
          <>
            <Input
              type="file"
              name="notesPptx"
              id="notesPptx"
              accept=".pptx"
              required
            />
            {error.notesPptx && (
              <p className="text-destructive">{error.notesPptx}</p>
            )}
          </>
        );
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <Label
          htmlFor={
            format === "text"
              ? "notesText"
              : format === "pdf"
              ? "notesPdf"
              : "notesPptx"
          }
        >
          Notes
        </Label>
        <Select
          name="format"
          required
          value={format}
          onValueChange={(e) => setFormat(e as InputFormat)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an Input Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Formats</SelectLabel>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="pptx">Power Point</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error.format && <p className="text-destructive">{error.format}</p>}
      {renderInput()}
    </>
  );
}

function SyllabusInput({ error }: InputProps) {
  const [format, setFormat] = useState<InputFormat>("text");

  function renderInput() {
    switch (format) {
      case "text":
        return (
          <>
            <Textarea name="syllabusText" id="syllabusText" required />
            {error.syllabusText && (
              <p className="text-destructive">{error.syllabusText}</p>
            )}
          </>
        );
      case "pdf":
        return (
          <>
            <Input
              type="file"
              name="syllabusPdf"
              id="syllabusPdf"
              accept=".pdf"
              required
            />
            {error.syllabusPdf && (
              <p className="text-destructive">{error.syllabusPdf}</p>
            )}
          </>
        );
      case "pptx":
        return (
          <>
            <Input
              type="file"
              name="syllabusPptx"
              id="syllabusPptx"
              accept=".pptx"
              required
            />
            {error.syllabusPptx && (
              <p className="text-destructive">{error.syllabusPptx}</p>
            )}
          </>
        );
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <Label
          htmlFor={
            format === "text"
              ? "syllabusText"
              : format === "pdf"
              ? "syllabusPdf"
              : "syllabusPptx"
          }
        >
          Syllabus
        </Label>
        <Select
          required
          value={format}
          onValueChange={(e) => setFormat(e as InputFormat)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an Input Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Formats</SelectLabel>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="pptx">Power Point</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error.format && <p className="text-destructive">{error.format}</p>}
      {renderInput()}
    </>
  );
}

function CourseInfoInput({ error }: InputProps) {
  return (
    <>
      <Label htmlFor="university">University</Label>
      <Input
        type="text"
        name="university"
        id="university"
        required
        placeholder="University of South Carolina"
      />
      {error.university && (
        <p className="text-destructive">{error.university}</p>
      )}
      <Label htmlFor="department">Department</Label>
      <Input
        type="text"
        name="department"
        id="department"
        required
        placeholder="Computer Science"
      />
      {error.department && (
        <p className="text-destructive">{error.department}</p>
      )}
      <Label htmlFor="courseNumber">Course Number</Label>
      <Input
        type="text"
        name="courseNumber"
        id="courseNumber"
        required
        placeholder="CSCE 350"
      />
      {error.courseNumber && (
        <p className="text-destructive">{error.courseNumber}</p>
      )}
      <Label htmlFor="courseName">Course Name</Label>
      <Input
        type="text"
        name="courseName"
        id="courseName"
        required
        placeholder="Data Structures and Algorithms"
      />
      {error.courseName && (
        <p className="text-destructive">{error.courseName}</p>
      )}
    </>
  );
}
