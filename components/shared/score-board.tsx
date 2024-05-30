"use client";

import { useTypingContext } from "@/context/typing";

export default function ScoreBoard() {
  const context = useTypingContext();

  if (!context) return null;

  return (
    <div className="">
      <p className="">WPM: {context.wpm}</p>
      <p className="">Accuracy: {context.accuracy}%</p>
      <p className="">Character typed: {context.characterTyped}</p>
      <p className="">
        Corrected Character Typed: {context.correctedCharacterTyped}
      </p>
      <p className="">
        Incorrected Character Typed: {context.incorrectedCharacterTyped}
      </p>
    </div>
  );
}
