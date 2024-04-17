"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "@/app/page.module.css";
import { useEffect, useState } from "react";
import React from "react";
import { Question } from "@/utils/types";

export default function Home() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [activeQueIndex, setActiveQueIndex] = useState<number>(0);

  const keyEvent = (e: KeyboardEvent) => {
    const queBtns = document.getElementsByClassName(
      styles.queBtn
    ) as HTMLCollectionOf<HTMLButtonElement>;
    const activeQueIndex =
      Number(
        document.getElementById(`question-header`)?.innerText.split(" ")[1]
      ) - 1;
    if (e.shiftKey || e.ctrlKey || e.altKey || !activeQue || !questions) return;
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
      (async function () {
        const result = await (await fetch("/api/get-result")).json();
        if (result?.results?.questions) {
          const questions = JSON.parse(result.results.questions);
          setQuestions(questions);
          setScore(result.results.score);
        }
      })();
    })();
  }, [status]);

  const activeQue = questions?.[activeQueIndex];

  return (
    <main className={styles.main}>
      <div className={styles.title}>Quiz Results</div>
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
                        ? activeQue.selectedAnswer === activeQue.correctAnswer
                          ? ` ${styles.right}`
                          : ` ${styles.wrong}`
                        : activeQue.correctAnswer === value
                        ? ` ${styles.right}`
                        : ""
                    }`}
                  >
                    <span>{value}</span>
                  </div>
                ))}
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
              {typeof score === "number" && (
                <div>
                  Scored {score} out of {questions.length}{" "}
                  {`(${
                    activeQue.selectedAnswer ? "selected" : "not selected"
                  })`}
                </div>
              )}
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
