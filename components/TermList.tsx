import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermListProps {
  terms: string[];
  onSelectTerm: (term: string) => void;
}

export function TermList({ terms, onSelectTerm }: TermListProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const handleSelectTerm = (term: string) => {
    setSelectedTerm(term);
    onSelectTerm(term);
  };

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border dark:border-gray-700 p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {terms.map((term) => (
          <Button
            key={term}
            variant={selectedTerm === term ? "secondary" : "outline"}
            onClick={() => handleSelectTerm(term)}
            className="justify-start dark:text-gray-300 text-xs sm:text-sm"
          >
            {term}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
