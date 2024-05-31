"use client";

import { faker } from "@faker-js/faker/locale/vi";
import {
  ChangeEvent,
  KeyboardEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type TypingContextData = {
  words: string[];
  typingWord: string;
  time: number;
  isEnd: boolean;
  accuracy: number;
  wpm: number;
  characterTyped: number;
  correctedCharacterTyped: number;
  incorrectedCharacterTyped: number;
  wordsError: number[];
  currentWordIndex: number;
  isTypingWrongWord: boolean;
  onTyping: (evt: ChangeEvent<HTMLInputElement>) => void;
  onCheckWordStatus: (evt: KeyboardEvent<HTMLInputElement>) => void;
  onChangeTypingLanguage: (lang: string) => void;
};

const MAXIMUM_WORDS = 180;
const TYPING_TIMER = 60; // (second)
const MIN_CHARACTER_LEN = 2;
const MAX_CHARACTER_LEN = 6;
const CHAR_AVERAGE_PER_WORD = (MIN_CHARACTER_LEN + MAX_CHARACTER_LEN) / 2;

const TypingContext = createContext<TypingContextData | null>(null);
export const useTypingContext = () => useContext(TypingContext);

let timer: NodeJS.Timeout;

const createListWords = (lang: string) => {
  const words = Array.from({ length: MAXIMUM_WORDS }, () => {
    return faker.word
      .sample({ length: { min: MIN_CHARACTER_LEN, max: MAX_CHARACTER_LEN } })
      .toLowerCase();
  });

  return Array.from(new Set(words));
};

export default function TypingProvider({ children }: PropsWithChildren) {
  const [words, setWords] = useState(createListWords(""));

  const [characterTyped, setCharacterTyped] = useState(0);
  const [correctedCharacterTyped, setCorrectedCharacterTyped] = useState(0);
  const incorrectedCharacterTyped = useMemo(
    () => characterTyped - correctedCharacterTyped,
    [characterTyped, correctedCharacterTyped],
  );
  const accuracy = useMemo(
    () => +((correctedCharacterTyped / characterTyped) * 100).toFixed(1),
    [characterTyped, correctedCharacterTyped],
  );

  const [typingWord, setTypingWord] = useState("");
  const [wordsError, setWordsError] = useState<number[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [time, setTime] = useState(TYPING_TIMER);

  const isEnd = useMemo(() => time === 0, [time]);
  const isTypingWrongWord = useMemo(
    () => !words[currentWordIndex].includes(typingWord.trim()),
    [words, currentWordIndex, typingWord],
  );
  const wpm = useMemo(
    () =>
      Math.round(
        (correctedCharacterTyped / CHAR_AVERAGE_PER_WORD / TYPING_TIMER) * 60,
      ),
    [correctedCharacterTyped],
  );

  const onTyping = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setTypingWord(evt.target.value);

      const trimmedValue = evt.target.value.trim();

      if (trimmedValue !== "") {
        if (words[currentWordIndex].includes(trimmedValue)) {
          setCorrectedCharacterTyped(
            (previousCorrectedCharacterTyped) =>
              previousCorrectedCharacterTyped + 1,
          );
        }
      }

      if (!timer) {
        timer = setInterval(() => {
          setTime((previousTime) => previousTime - 1);
        }, 1000);
      }
    },
    [words, currentWordIndex],
  );

  const onCheckWordStatus = useCallback(
    (evt: KeyboardEvent<HTMLInputElement>) => {
      const spacebarPressed = evt.key === " ";

      if (spacebarPressed) {
        // Reset Input
        setTypingWord("");

        // Move on to the next word
        setCurrentWordIndex((previousIndex) => previousIndex + 1);
        if (
          isTypingWrongWord ||
          typingWord.trim() !== words[currentWordIndex]
        ) {
          setWordsError((previousWordsError) => [
            ...previousWordsError,
            currentWordIndex,
          ]);
        }
      } else {
        setCharacterTyped(
          (previousCharacterTyped) => previousCharacterTyped + 1,
        );
      }
    },
    [isTypingWrongWord, currentWordIndex, words, typingWord],
  );

  const onChangeTypingLanguage = useCallback((lang: string) => {
    setWords(createListWords(""));
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setTypingWord("");

    if (isEnd) {
      clearInterval(timer);
    }
  }, [isEnd]);

  return (
    <TypingContext.Provider
      value={{
        words,
        time,
        isEnd,
        wpm,
        accuracy,
        characterTyped,
        correctedCharacterTyped,
        incorrectedCharacterTyped,
        typingWord,
        wordsError,
        currentWordIndex,
        isTypingWrongWord,
        onTyping,
        onCheckWordStatus,
        onChangeTypingLanguage,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
