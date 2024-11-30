import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://journalducoin.com/lexique/');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const terms: string[] = [];
    $('.glossary-link-item a').each((_, element) => {
      const term = $(element).text();
      if (term) {
        terms.push(term);
      }
    });

    return NextResponse.json(terms);
  } catch (error) {
    console.error('Error scraping terms:', error);
    return NextResponse.json({ error: 'Failed to scrape terms' }, { status: 500 });
  }
}

