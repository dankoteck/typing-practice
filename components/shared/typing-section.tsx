"use client";

import { useTypingContext } from "@/context/typing";
import { cn } from "@/lib/utils";
import { ChangeEvent, useRef } from "react";
import { Input } from "../ui/input";
import ClientOnly from "./client-only";
import ScoreBoard from "./score-board";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function TypingSection() {
  const context = useTypingContext();
  const listWordsRef = useRef<HTMLUListElement | null>(null);

  const handleTyping = (evt: ChangeEvent<HTMLInputElement>) => {
    if (context && listWordsRef.current) {
      context.onTyping(evt);

      const currentWord = listWordsRef.current.childNodes[
        context.currentWordIndex
      ] as HTMLLIElement;

      currentWord.scrollIntoView();
    }
  };

  if (context?.isEnd) {
    return <ScoreBoard />;
  }

  return (
    <section className="flex flex-col justify-center gap-4">
      <p className="mx-auto w-fit text-2xl">{context?.time}</p>

      <Select defaultValue="en" onValueChange={context?.onChangeTypingLanguage}>
        <SelectTrigger className="mx-auto w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="vi">Vietnamese</SelectItem>
        </SelectContent>
      </Select>

      <ClientOnly>
        <div className="mx-auto w-full max-w-[800px]">
          <ul
            ref={listWordsRef}
            className="flex h-[96px] select-none flex-wrap items-center overflow-hidden text-lg text-black"
          >
            {context
              ? context.words.map((word, i) => (
                  <li
                    key={word}
                    className={cn("rounded-md p-2 text-2xl", {
                      // Active/Current typing word
                      "bg-gray-300": i === context.currentWordIndex,

                      // Incorrect word already typed
                      "text-red-600": context.wordsError.includes(i),

                      // Current typing incorrect word
                      "bg-red-600 text-black":
                        i === context.currentWordIndex &&
                        context.isTypingWrongWord,

                      // Corrected word
                      "text-green-600":
                        context.currentWordIndex > i &&
                        !context.wordsError.includes(i),
                    })}
                  >
                    {word}
                  </li>
                ))
              : null}
          </ul>
        </div>
      </ClientOnly>

      <div className="mx-auto w-full max-w-[800px]">
        <Input
          autoFocus
          onChange={handleTyping}
          onKeyDown={context?.onCheckWordStatus}
          value={context?.typingWord}
          disabled={context?.isEnd}
        />
      </div>
    </section>
  );
}
