import QuizApp from '@/components/QuizApp'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Quiz Blockchain et Web3</h1>
      <QuizApp />
    </main>
  )
}

