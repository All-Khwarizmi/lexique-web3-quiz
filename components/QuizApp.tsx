import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TermList } from "./TermList";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface TermDefinition {
  term: string;
  definition: string;
}

interface HistoryItem extends TermDefinition {
  confidence: number;
}

export default function QuizApp() {
  const [terms, setTerms] = useState<string[]>([]);
  const [currentTerm, setCurrentTerm] = useState<TermDefinition | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [confidence, setConfidence] = useState(50);

  const fetchTerms = async () => {
    try {
      const response = await fetch("/api/terms");
      const data = await response.json();
      setTerms(data);
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  };

  const fetchTerm = async (term?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/scrape${term ? `?term=${term}` : ""}`);
      const data = await response.json();
      setCurrentTerm(data);
      setUserAnswer("");
      setShowAnswer(false);
      setConfidence(50);
    } catch (error) {
      console.error("Error fetching term:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTerms();
    fetchTerm();
  }, []);

  const handleConfidenceRating = (rating: number) => {
    setConfidence(rating);
    if (currentTerm) {
      const historyItem: HistoryItem = { ...currentTerm, confidence: rating };
      setHistory((prevHistory) => [...prevHistory, historyItem]);
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 space-y-4">
      <Card className="w-full bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-700 dark:to-blue-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <Sparkles className="mr-2" />
            Quiz Blockchain et Web3
            <Sparkles className="ml-2" />
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="terms">Liste des termes</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz">
          <Card className="bg-background dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLoading ? "Chargement..." : currentTerm?.term}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre réponse"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
                {showAnswer && currentTerm && (
                  <div className="mt-4 p-4 bg-secondary dark:bg-gray-700 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">Définition :</h3>
                    <p className="text-secondary-foreground dark:text-gray-300">
                      {currentTerm.definition}
                    </p>
                  </div>
                )}
                {showAnswer && (
                  <div className="space-y-2">
                    <p className="font-semibold">Évaluez votre confiance :</p>
                    <Progress value={confidence} className="w-full" />
                    <div className="flex justify-between">
                      <Button onClick={() => handleConfidenceRating(0)}>
                        0%
                      </Button>
                      <Button onClick={() => handleConfidenceRating(25)}>
                        25%
                      </Button>
                      <Button onClick={() => handleConfidenceRating(50)}>
                        50%
                      </Button>
                      <Button onClick={() => handleConfidenceRating(75)}>
                        75%
                      </Button>
                      <Button onClick={() => handleConfidenceRating(100)}>
                        100%
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={() => setShowAnswer(true)}
                variant="outline"
                disabled={isLoading}
              >
                Voir la réponse
              </Button>
              <Button onClick={() => fetchTerm()} disabled={isLoading}>
                Terme suivant
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card className="bg-background dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Liste des termes</CardTitle>
            </CardHeader>
            <CardContent>
              <TermList
                terms={terms}
                onSelectTerm={(term) => fetchTerm(term)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-background dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="mb-4 p-2 border-b dark:border-gray-700"
                  >
                    <h3 className="font-semibold">{item.term}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confiance : {item.confidence}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
