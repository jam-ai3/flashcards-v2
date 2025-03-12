import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { NetworkRequest } from "../../hooks/api-call";
import Spinner from "../../components/spinner/spinner";
import FlashcardsGrid from "./components/grid/flashcards-grid";
import GenerateForm from "./components/form/generate-form";
import { useNavigate } from "react-router-dom";
import { GenerateFlashcardsArgs, GenerateResponse } from "../../types";
import { api } from "../../api";
import Toast from "../../components/toast/toast";

export default function Home() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<
    NetworkRequest<GenerateResponse>
  >({
    data: { flashcards: [], type: null },
    error: null,
    loading: false,
  });
  const cards = flashcards.data.flashcards;

  async function handleGenerate(args: GenerateFlashcardsArgs) {
    setFlashcards((prev) => ({ ...prev, loading: true }));
    try {
      let text: string | undefined;
      if (args.text !== undefined && args.inputFormat === "text") {
        text = args.text;
      } else if (args.pdf !== undefined && args.inputFormat === "pdf") {
        text = (await api.parsePdf(args.pdf)).data;
      } else if (args.pptx !== undefined && args.inputFormat === "pptx") {
        text = (await api.parsePptx(args.pptx)).data;
      }
      if (text === undefined) {
        // handle error
        return setFlashcards({
          data: { flashcards: [], type: null },
          loading: false,
          error: { code: 400, message: "No text found" },
        });
      }
      const res = await api.generateFlashcards(args.type, text);
      setFlashcards({
        data: res.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message ?? error.message ?? "";
      const code = error.response?.status ?? 500;
      setFlashcards({
        data: { flashcards: [], type: null },
        loading: false,
        error: { code, message },
      });
    }
  }

  function handleBack() {
    setFlashcards({
      data: { flashcards: [], type: null },
      error: null,
      loading: false,
    });
  }

  useEffect(() => {
    if (flashcards.error?.code === 401) {
      navigate("/product");
    }
  }, [flashcards.error?.code]);

  if (cards.length > 0) {
    return <FlashcardsGrid resp={flashcards.data} onBack={handleBack} />;
  }

  if (flashcards.loading) {
    return (
      <main className={styles["loading-main"]}>
        <div className={styles["loading-container"]}>
          <p className={styles["loading-header"]}>Generating Cards...</p>
          <p className={styles["loading-description"]}>
            This may take up to a minute depending on the size of information
            uploaded
          </p>
          <Spinner size={24} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles["text-container"]}>
        <p className={styles["section-header"]}>Generate Flashcards</p>
        <p className={styles.description}>
          Enter some information about your course to generate flashcards
        </p>
      </section>
      <GenerateForm handleGenerate={handleGenerate} />
      <Toast
        message={flashcards.error?.message ?? null}
        state="error"
        onClear={() => setFlashcards((prev) => ({ ...prev, error: null }))}
      />
    </main>
  );
}
