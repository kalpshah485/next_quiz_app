"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "@/app/page.module.css";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    (async function () {
      if (status === "unauthenticated" || status === "loading") return;
      (async function () {
        const result = await (await fetch("/api/get-result")).json();
        if (typeof result?.results?.score === "number") {
          setScore(result.results.score);
        }
      })();
    })();
  }, [status]);

  const scorePercentage = score ? (score / 10) * 100 : 0;

  return (
    <main className={styles.main}>
      <div className={styles.title}>Quiz Results</div>
      <div className={`${styles.model} ${styles.center}`}>
        {score !== null && (
          <>
            {scorePercentage >= 40 ? (
              <div className={styles.passFailSvg}>
                <svg
                  className={styles.svgIcon}
                  style={{
                    width: "1em",
                    height: "1em",
                    verticalAlign: "middle",
                    fill: "currentColor",
                    overflow: "hidden",
                  }}
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M426.666667 725.333333l-213.333334-213.333333 60.16-60.16L426.666667 604.586667l323.84-323.84L810.666667 341.333333z m85.333333-640a426.666667 426.666667 0 1 0 426.666667 426.666667A426.666667 426.666667 0 0 0 512 85.333333z"
                    fill="#31A400"
                  />
                </svg>
                <div>Nice job, You Passed!</div>
              </div>
            ) : (
              <div className={styles.passFailSvg}>
                <svg
                  className={styles.svgIcon}
                  style={{
                    width: "1em",
                    height: "1em",
                    verticalAlign: "middle",
                    fill: "currentColor",
                    overflow: "hidden",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#f44336"
                    d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                  ></path>
                </svg>
                <div>Sorry, you didn't pass.</div>
              </div>
            )}
            <div className={styles.summaryContainer}>
              <div className={styles.cardContainer}>
                <div className={styles.scoreTitle}>Your Score</div>
                <div
                  className={`${styles.score} ${
                    scorePercentage >= 40 ? styles.pass : styles.fail
                  }`}
                >
                  {scorePercentage}%
                </div>
                <div className={styles.passingScore}>Passing Score: 40%</div>
              </div>
              <div className={styles.cardContainer}>
                <div className={styles.scoreTitle}>Your points</div>
                <div
                  className={`${styles.score} ${
                    scorePercentage >= 40 ? styles.pass : styles.fail
                  }`}
                >
                  {score}
                </div>
                <div className={styles.passingScore}>Passing points: 4</div>
              </div>
            </div>
            <Link className={styles.reviewBtn} href="results">
              Review Quiz
            </Link>
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
