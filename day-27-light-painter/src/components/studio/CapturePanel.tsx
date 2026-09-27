import {
  Download,
  Image,
  Share2,
} from 'lucide-react'

import {
  downloadBlob,
  exportCanvas,
  type ExportRatio,
  imageFilename,
  shareBlob,
} from '../../lib/export'

import { saveGalleryItem } from '../../lib/gallery-db'

import { Sheet } from '../ui/Sheet'

interface Props {
  blob: Blob
  canvas: HTMLCanvasElement
  overlayCanvas: HTMLCanvasElement
  mode: string

  onClose(): void
  onToast(message: string): void
}

const RATIOS: ExportRatio[] = [
  'original',
  '1:1',
  '9:16',
  '16:9',
]

export function CapturePanel({
  blob,
  canvas,
  overlayCanvas,
  mode,
  onClose,
  onToast,
}: Props) {
  const url =
    URL.createObjectURL(blob)

  const create = async (
    ratio: ExportRatio,
  ) => {
    return exportCanvas(
      canvas,
      ratio,
      overlayCanvas,
    )
  }

  const download = async (
    ratio: ExportRatio,
  ) => {
    const next =
      await create(ratio)

    downloadBlob(
      next,
      imageFilename(),
    )
  }

  const share = async (
    ratio: ExportRatio,
  ) => {
    const next =
      await create(ratio)

    const shared =
      await shareBlob(
        next,
        imageFilename(),
      )

    if (!shared) {
      downloadBlob(
        next,
        imageFilename(),
      )

      onToast(
        'SHARE UNAVAILABLE · IMAGE DOWNLOADED',
      )
    }
  }

  const local = async (
    ratio: ExportRatio,
  ) => {
    const next =
      await create(ratio)

    await saveGalleryItem({
      type: 'image',
      blob: next,
      mode,
    })

    onToast(
      'SAVED ON THIS DEVICE.',
    )
  }

  return (
    <Sheet
      title="CAPTURED"
      onClose={() => {
        URL.revokeObjectURL(url)
        onClose()
      }}
      wide
    >
      <div className="p-5">
        <div className="overflow-hidden border border-white/10 bg-black">
          <img
            src={url}
            alt="Captured light painting"
            className="aspect-video w-full object-contain"
          />
        </div>

        <div className="mt-4 flex justify-between text-[9px] tracking-[0.12em] text-white/34">
          <span>
            {canvas.width} ×{' '}
            {canvas.height}
          </span>

          <span>PNG</span>
        </div>

        <p className="mt-8 text-[9px] tracking-[0.16em] text-white/38">
          SAVE PAINTING.
        </p>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {RATIOS.map(
            (ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => {
                  void download(
                    ratio,
                  )
                }}
                className="border border-white/10 px-2 py-4 text-[9px] tracking-[0.1em] text-white/60 hover:bg-white hover:text-black"
              >
                {ratio.toUpperCase()}
              </button>
            ),
          )}
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              void download(
                'original',
              )
            }}
            className="flex items-center justify-between bg-white px-4 py-4 text-[9px] font-semibold tracking-[0.12em] text-black"
          >
            SAVE IMAGE
            <Download size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              void share('original')
            }}
            className="flex items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.12em] text-white/62"
          >
            SHARE
            <Share2 size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              void local('original')
            }}
            className="flex items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.12em] text-white/62"
          >
            LOCAL GALLERY
            <Image size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full px-4 py-4 text-[9px] tracking-[0.13em] text-white/42"
        >
          KEEP PAINTING
        </button>
      </div>
    </Sheet>
  )
}
