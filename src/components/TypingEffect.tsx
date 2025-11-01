"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/landing.module.css";

type Props = {
  firstLine: string; // typed letter-by-letter
  secondLine: string; // typed letter-by-letter after first completes
  onComplete?: () => void;
};

export default function TypingEffect({ firstLine, secondLine, onComplete }: Props) {
  // both lines typed letter-by-letter
  const [firstDisplayed, setFirstDisplayed] = useState("");
  const [secondDisplayed, setSecondDisplayed] = useState("");
  const [firstDone, setFirstDone] = useState(false);

  useEffect(() => {
    // letter-by-letter for first line
    let mounted = true;
    let i = 0;
    const chars = firstLine.split("");
    const step = () => {
      if (!mounted) return;
      if (i <= chars.length) {
        setFirstDisplayed(chars.slice(0, i).join(""));
        i += 1;
        // slower letter speed as requested (80ms)
        setTimeout(step, 80);
      } else {
        setFirstDone(true);
      }
    };
    const starter = setTimeout(step, 200); // small initial delay
    return () => {
      mounted = false;
      clearTimeout(starter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLine]);

  useEffect(() => {
    if (!firstDone) return;
    let i = 0;
    const chars = secondLine.split("");
    let mounted = true;
    const step = () => {
      if (!mounted) return;
      if (i <= chars.length) {
        setSecondDisplayed(chars.slice(0, i).join(""));
        i += 1;
        // slower letter speed to match the requested reduction
        setTimeout(step, 80);
      } else {
        if (onComplete) onComplete();
      }
    };
    const starter = setTimeout(step, 300); // slight pause before second line
    return () => {
      mounted = false;
      clearTimeout(starter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDone, secondLine]);

  return (
    <>
      <h1 className={styles.headline}>
        <span className={styles.headlineTop}>
          {firstDisplayed}
          {!firstDone && <span className={styles.typingCaret} />}
        </span>
        <br />
        <span className={styles.headlineSecond}>
          {secondDisplayed}
          {firstDone && secondDisplayed.length < secondLine.length && <span className={styles.typingCaret} />}
        </span>
      </h1>
    </>
  );
}
