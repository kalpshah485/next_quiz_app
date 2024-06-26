"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

type Question = {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: Array<string>;
  mixAnswers: string[];
  selectedAnswer?: string;
  question: {
    text: string;
  };
  tags: Array<string>;
  type: string;
  difficulty: string;
  regions: [];
  isNiche: boolean;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [activeQueIndex, setActiveQueIndex] = useState<number>(0);

  const router = useRouter();

  const keyEvent = (e: KeyboardEvent) => {
    const keys = ["1", "2", "3", "4"];
    if (e.shiftKey || e.ctrlKey || e.altKey || !activeQue || !questions) return;
    const queBtns = document.getElementsByClassName(
      styles.queBtn
    ) as HTMLCollectionOf<HTMLButtonElement>;
    const activeQueIndex =
      Number(
        document.getElementById(`question-header`)?.innerText.split(" ")[1]
      ) - 1;
    if (e.code === "ArrowRight") {
      setActiveQueIndex((prev) => {
        if (questions && prev >= questions.length - 1) {
          return prev;
        }
        queBtns[activeQueIndex + 1].focus();
        return prev + 1;
      });
    } else if (e.code === "ArrowLeft") {
      setActiveQueIndex((prev) => {
        if (prev <= 0) {
          return prev;
        }
        queBtns[activeQueIndex - 1].focus();
        return prev - 1;
      });
    } else if (keys.includes(e.key)) {
      setQuestions((prevQues) => {
        if (!prevQues) return prevQues;
        const ques = [...prevQues];
        ques[activeQueIndex].selectedAnswer =
          ques[activeQueIndex].mixAnswers[Number(e.key) - 1];
        return ques;
      });
    } else return;
  };

  useEffect(() => {
    window.addEventListener("keydown", keyEvent);
    return () => {
      window.removeEventListener("keydown", keyEvent);
    };
  }, [questions?.length]);

  useEffect(() => {
    (async function () {
      if (status === "unauthenticated" || status === "loading") return;
      const questions: Question[] = await (
        await fetch("https://the-trivia-api.com/v2/questions/")
      ).json();

      const newQuestions = questions.map((question) => {
        question.mixAnswers = mixAnswers(
          question.correctAnswer,
          question.incorrectAnswers
        );
        return question;
      });

      setQuestions(newQuestions);
    })();
  }, [status]);

  const activeQue = questions?.[activeQueIndex];

  function mixAnswers(correctAnswer: string, wrongAnswers: Array<string>) {
    // Combine correct answer with wrong answers
    const combinedAnswers = [correctAnswer, ...wrongAnswers];

    // Shuffle the combined array
    for (let i = combinedAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedAnswers[i], combinedAnswers[j]] = [
        combinedAnswers[j],
        combinedAnswers[i],
      ];
    }

    return combinedAnswers;
  }

  async function uploadResult() {
    const conf = confirm("are you sure you want to finish?");
    if (conf) {
      const strQues = JSON.stringify(questions);
      localStorage.setItem("results", strQues);
      const res = await fetch("/api/add-result", {
        method: "POST",
        body: strQues,
      });
      const data: { updated: any } = await res.json();
      if (res.ok && data.updated) {
        router.push("/result-summary");
      }
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>Quiz App</div>
      <div className={styles.queHeader}>
        {React.Children.toArray(
          questions?.map((question, index) => (
            <button
              className={`${styles.queBtn}${
                index === activeQueIndex ? " " + styles.underline : ""
              }`}
              onClick={() => setActiveQueIndex(index)}
            >
              {index + 1}
            </button>
          ))
        )}
      </div>
      <div className={styles.model}>
        {activeQue && (
          <>
            <h1 id="question-header" className={styles.questionLabel}>
              Question {activeQueIndex + 1}
            </h1>
            <div className={styles.question}>
              <div className={styles.queName}>{activeQue.question.text}</div>
              <div className={styles.options}>
                {activeQue.mixAnswers.map((value) => (
                  <div
                    key={value}
                    className={`${styles.option}${
                      activeQue.selectedAnswer === value
                        ? ` ${styles.selected}`
                        : ""
                    }`}
                    onClick={() => {
                      if (questions[activeQueIndex].selectedAnswer === value) {
                        questions[activeQueIndex].selectedAnswer = undefined;
                        setQuestions([...questions]);
                      } else {
                        questions[activeQueIndex].selectedAnswer = value;
                        setQuestions([...questions]);
                      }
                    }}
                  >
                    <span>{value}</span>
                  </div>
                ))}
                {/* 
                <div className={`${styles.option} ${styles.selected}`}>
                  <span>option 1</span>
                </div>
                <div className={styles.option}>
                  <span>option 2</span>
                </div>
                <div className={styles.option}>
                  <span>option 3</span>
                </div>
                <div className={styles.option}>
                  <span>option 4</span>
                </div> */}
              </div>
            </div>
            <div className={styles.buttons}>
              <button
                className={`${styles.button} ${styles.prev}`}
                onClick={() => setActiveQueIndex(activeQueIndex - 1)}
                disabled={activeQueIndex === 0}
              >
                Prev
              </button>
              <button className={styles.button} onClick={uploadResult}>
                Finish
              </button>
              <button
                className={`${styles.button} ${styles.next}`}
                onClick={() => setActiveQueIndex(activeQueIndex + 1)}
                disabled={activeQueIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      {session ? (
        <div style={{ textAlign: "center" }}>
          Signed in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <div>
          Not signed in <br /> <button onClick={() => signIn()}>Sign in</button>
        </div>
      )}
    </main>
  );
}
