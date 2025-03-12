import styles from "./generateform.module.css";
import { useState } from "react";
import {
  GenerateFlashcardsArgs,
  GenerateType,
  InputFormat,
} from "../../../../types";

type GenerateFormProps = {
  handleGenerate: (args: GenerateFlashcardsArgs) => void;
};

export default function GenerateForm({ handleGenerate }: GenerateFormProps) {
  const [type, setType] = useState<GenerateType>("notes");
  const [inputFormat, setInputFormat] = useState<InputFormat>("pdf");
  const [notesText, setNotesText] = useState("");
  const [notesPdf, setNotesPdf] = useState<File | null>(null);
  const [notesPptx, setNotesPptx] = useState<File | null>(null);
  const [syllabusText, setSyllabusText] = useState("");
  const [syllabusPdf, setSyllabusPdf] = useState<File | null>(null);
  const [syllabusPptx, setSyllabusPptx] = useState<File | null>(null);
  const [courseInfo, setCourseInfo] = useState({
    university: "",
    department: "",
    courseNumber: "",
    courseName: "",
  });

  function onGenerate() {
    let text = "";
    let pdf: File | undefined = undefined;
    let pptx: File | undefined = undefined;
    switch (type) {
      case "notes":
        text = notesText;
        pdf = notesPdf ?? undefined;
        pptx = notesPptx ?? undefined;
        break;
      case "syllabus":
        text = syllabusText;
        pdf = syllabusPdf ?? undefined;
        pptx = syllabusPptx ?? undefined;
        break;
      case "courseInfo":
        text = JSON.stringify(courseInfo);
        break;
    }
    handleGenerate({ type, inputFormat, text, pptx, pdf });
  }

  function renderInput() {
    switch (type) {
      case "notes":
        return (
          <div className={styles["input-type-container"]}>
            <select
              id="type-select"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value as InputFormat)}
            >
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="pptx">Power Point</option>
            </select>
            {inputFormat === "text" && (
              <textarea
                placeholder="Notes..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            )}
            {inputFormat === "pdf" && (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setNotesPdf(e.target.files![0])}
              />
            )}
            {inputFormat === "pptx" && (
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => setNotesPptx(e.target.files![0])}
              />
            )}
          </div>
        );
      case "syllabus":
        return (
          <div className={styles["input-type-container"]}>
            <select
              id="type-select"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value as InputFormat)}
            >
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="pptx">Power Point</option>
            </select>
            {inputFormat === "text" && (
              <textarea
                placeholder="Syllabus..."
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
              />
            )}
            {inputFormat === "pdf" && (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSyllabusPdf(e.target.files![0])}
              />
            )}
            {inputFormat === "pptx" && (
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => setSyllabusPptx(e.target.files![0])}
              />
            )}
          </div>
        );
      case "courseInfo":
        return (
          <>
            <div>
              <label htmlFor="university">University</label>
              <input
                id="university"
                placeholder="University of South Carolina"
                type="text"
                value={courseInfo.university}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, university: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                placeholder="Computer Science"
                type="text"
                value={courseInfo.department}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, department: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="course-number">Course Number</label>
              <input
                id="course-number"
                placeholder="CSCE 311"
                type="text"
                value={courseInfo.courseNumber}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, courseNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="course-name">Course Name</label>
              <input
                id="course-name"
                placeholder="Operating Systems"
                type="text"
                value={courseInfo.courseName}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, courseName: e.target.value })
                }
              />
            </div>
          </>
        );
    }
  }

  return (
    <section className={styles.form}>
      <div className={styles["type-select"]}>
        <label htmlFor="type-select">Generate Prompt</label>
        <select
          id="type-select"
          value={type}
          onChange={(e) => setType(e.target.value as GenerateType)}
        >
          <option value="courseInfo">Course Info</option>
          <option value="notes">Notes</option>
          <option value="syllabus">Syllabus</option>
        </select>
      </div>
      <div className={styles["input-container"]}>{renderInput()}</div>
      <button onClick={onGenerate} className={styles["generate-btn"]}>
        Generate
      </button>
    </section>
  );
}
