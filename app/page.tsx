import QuizApp from "@/components/QuizApp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Quiz Blockchain et Web3</h1>
      <QuizApp />
    </main>
  );
}
