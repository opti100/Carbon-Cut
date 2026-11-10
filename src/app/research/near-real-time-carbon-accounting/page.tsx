import type { Metadata } from 'next'

import ResearchPaperPage from '@/components/research/ResearchPaperPage'
import { nearRealTimeCarbonAccountingPaper as paper } from '@/constants/research/nearRealTimeCarbonAccounting'

const PATH = `/research/${paper.slug}`
const DESCRIPTION =
  'A resolution-based attribution framework for near-real-time carbon accounting of internet data transmission, ' +
  'comparing conventional batch accounting with three hybrid and deterministic methods.'

export const metadata: Metadata = {
  title: paper.shortTitle,
  description: DESCRIPTION,
  keywords: paper.keywords,
  authors: paper.authors.map((a) => ({ name: a.name })),
  alternates: { canonical: PATH },
  openGraph: {
    type: 'article',
    url: PATH,
    title: paper.title,
    description: DESCRIPTION,
    publishedTime: paper.publishedDate,
    authors: paper.authors.map((a) => a.name),
    images: [{ url: paper.figures[5].src, alt: `Figure 6: ${paper.figures[5].caption}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: paper.shortTitle,
    description: DESCRIPTION,
  },
}

export default function NearRealTimeCarbonAccountingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    abstract: paper.abstract,
    keywords: paper.keywords.join(', '),
    datePublished: paper.publishedDate,
    creativeWorkStatus: paper.status,
    author: paper.authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      affiliation: a.affiliations.map((i) => ({
        '@type': 'Organization',
        name: paper.affiliations[i - 1],
      })),
    })),
    publisher: { '@type': 'Organization', name: 'CarbonCut' },
    encoding: {
      '@type': 'MediaObject',
      contentUrl: paper.pdfUrl,
      encodingFormat: 'application/pdf',
    },
    url: `https://carboncut.co${PATH}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResearchPaperPage paper={paper} />
    </>
  )
}
