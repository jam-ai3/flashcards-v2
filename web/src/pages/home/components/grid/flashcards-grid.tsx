import styles from "./flashcardsgrid.module.css";
import { useState } from "react";
import { FaChevronLeft, FaSave } from "react-icons/fa";
import { exportToCSV } from "../../../../helpers";
import { GenerateResponse, RawFlashcard } from "../../../../types";
import Toast from "../../../../components/toast/toast";

type FlashcardsGridProps = {
  resp: GenerateResponse;
  onBack: () => void;
};

const TOAST_MESSAGE = "Free uses are limited to 4 flashcards";

export default function FlashcardsGrid({ resp, onBack }: FlashcardsGridProps) {
  const [selected, setSelected] = useState<RawFlashcard[]>([]);
  const [message, setMessage] = useState<string | null>(
    resp.type === "free" ? TOAST_MESSAGE : null
  );
  const cards = resp.flashcards;

  function toggleSelectAll() {
    if (selected.length === cards.length) {
      setSelected([]);
    } else {
      setSelected(cards);
    }
  }

  function toggleSelect(flashcard: RawFlashcard) {
    if (selected.includes(flashcard)) {
      setSelected(selected.filter((f) => f !== flashcard));
    } else {
      setSelected([...selected, flashcard]);
    }
  }

  return (
    <main className={styles["grid-main"]}>
      <div className={styles.subheader}>
        <button onClick={onBack} className={styles["back-btn"]}>
          <FaChevronLeft />
          <span>Back</span>
        </button>
        <div className={styles["subheader-btns"]}>
          <button
            onClick={toggleSelectAll}
            className={styles["select-all-btn"]}
          >
            <div
              className={`
              ${styles["select-circle"]}
              ${selected.length === cards.length ? styles.selected : ""}`}
            />
            <span>
              {selected.length} / {cards.length}
            </span>
            <span>
              {selected.length === cards.length ? "Deselect" : "Select All"}
            </span>
          </button>
          <button
            onClick={() => exportToCSV(selected)}
            disabled={selected.length === 0}
            className={styles["export-btn"]}
          >
            <FaSave />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      <div>
        {/* TODO: maybe implement */}
        {/* <button onClick={flashcards.fetchData}>
          <FaArrowsToCircle />
          <span>Regenerate</span>
        </button> */}
      </div>
      <div className={styles["flashcard-grid"]}>
        {cards.map((f, i) => (
          <div
            key={i}
            className={`${styles.flashcard} ${
              selected.includes(f) ? styles.selected : ""
            }`}
            onClick={() => toggleSelect(f)}
          >
            <p>{f.front}</p>
            <p>{f.back}</p>
          </div>
        ))}
      </div>
      <Toast
        message={message}
        onClear={() => setMessage(null)}
        state="info"
        disappears={false}
      />
    </main>
  );
}
