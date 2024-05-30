import TypingSection from "@/components/shared/typing-section";
import TypingProvider from "@/context/typing";

export default function Home() {
  return (
    <main className="mt-4">
      <TypingProvider>
        <TypingSection />
      </TypingProvider>
    </main>
  );
}
