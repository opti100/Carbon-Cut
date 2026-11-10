'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { ResearchFigure } from '@/types/research'

// Recharts is only needed for the interactive figures; keep it out of the initial bundle.
const ResearchChart = dynamic(() => import('./ResearchCharts'), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-neutral-100" />,
})

function FigureCaption({ figure }: { figure: ResearchFigure }) {
  return (
    <figcaption className="mt-4 text-sm leading-relaxed text-neutral-600">
      <span className="font-semibold text-[#080c04]">Figure {figure.number}.</span>{' '}
      {figure.caption}
    </figcaption>
  )
}

function StaticFigure({ figure }: { figure: ResearchFigure }) {
  const alt = `Figure ${figure.number}: ${figure.caption}`
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg"
          aria-label={`Enlarge figure ${figure.number}`}
        >
          <Image
            src={figure.src}
            alt={alt}
            width={figure.width}
            height={figure.height}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="h-auto w-full"
          />
          <span className="absolute right-3 top-3 rounded-md bg-white/90 p-1.5 text-neutral-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(1200px,95vw)] sm:max-w-[min(1200px,95vw)] bg-white p-4">
        <DialogTitle className="sr-only">Figure {figure.number}</DialogTitle>
        <Image
          src={figure.src}
          alt={alt}
          width={figure.width}
          height={figure.height}
          sizes="95vw"
          className="h-auto w-full"
        />
        <FigureCaption figure={figure} />
      </DialogContent>
    </Dialog>
  )
}

export default function ResearchFigureView({ figure }: { figure: ResearchFigure }) {
  return (
    <figure
      id={`figure-${figure.number}`}
      className="my-10 scroll-mt-24 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6"
    >
      {figure.interactive ? (
        <>
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="rounded-full bg-[#b0ea1d]/25 px-2.5 py-0.5 text-xs font-semibold text-[#3d5208]">
              Interactive
            </span>
            <a
              href={figure.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-[#080c04] hover:underline"
            >
              View figure as in paper
            </a>
          </div>
          <ResearchChart id={figure.interactive} />
        </>
      ) : (
        <StaticFigure figure={figure} />
      )}
      <FigureCaption figure={figure} />
    </figure>
  )
}
