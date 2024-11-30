import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface Term {
  term: string;
  url: string;
}

interface TermDefinition {
  term: string;
  definition: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specificTerm = searchParams.get("term");

  try {
    const response = await fetch("https://journalducoin.com/lexique/");
    const html = await response.text();
    const $ = cheerio.load(html);

    const terms: Term[] = [];
    $(".glossary-link-item a").each((_, element) => {
      const term = $(element).text();
      const url = $(element).attr("href");
      if (term && url) {
        terms.push({ term, url });
      }
    });

    let selectedTerm: Term;
    if (specificTerm) {
      selectedTerm =
        terms.find(
          (t) => t.term.toLowerCase() === specificTerm.toLowerCase()
        ) || terms[Math.floor(Math.random() * terms.length)];
    } else {
      selectedTerm = terms[Math.floor(Math.random() * terms.length)];
    }

    const termResponse = await fetch(selectedTerm.url);
    const termHtml = await termResponse.text();
    const $term = cheerio.load(termHtml);

    const definition = $term(".content p").first().text().trim();

    const termDefinition: TermDefinition = {
      term: selectedTerm.term,
      definition: definition,
    };

    return NextResponse.json(termDefinition);
  } catch (error) {
    console.error("Error scraping data:", error);
    return NextResponse.json(
      { error: "Failed to scrape data" },
      { status: 500 }
    );
  }
}
