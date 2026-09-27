import {
  Download,
  Share2,
  Trash2,
  Video,
} from 'lucide-react'

import {
  downloadBlob,
  shareBlob,
  videoFilename,
} from '../../lib/export'

import {
  saveGalleryItem,
} from '../../lib/gallery-db'

import {
  formatRecordingTime,
} from '../../lib/time'

import { Sheet } from '../ui/Sheet'

interface Props {
  blob: Blob
  duration: number
  mode: string

  onClose(): void
  onDiscard(): void
  onToast(message: string): void
}

export function RecordingPanel({
  blob,
  duration,
  mode,
  onClose,
  onDiscard,
  onToast,
}: Props) {
  const url =
    URL.createObjectURL(blob)

  const saveLocal = async () => {
    await saveGalleryItem({
      type: 'video',
      blob,
      mode,
      duration,
    })

    onToast(
      'VIDEO SAVED ON THIS DEVICE.',
    )
  }

  return (
    <Sheet
      title="SESSION RECORDED"
      onClose={() => {
        URL.revokeObjectURL(url)
        onClose()
      }}
      wide
    >
      <div className="p-5">
        <video
          src={url}
          controls
          playsInline
          className="aspect-video w-full border border-white/10 bg-black object-contain"
        />

        <div className="mt-4 flex justify-between text-[9px] tracking-[0.12em] text-white/38">
          <span>
            {formatRecordingTime(
              duration,
            )}
          </span>

          <span>WEBM</span>
        </div>

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              downloadBlob(
                blob,
                videoFilename(),
              )
            }
            className="flex items-center justify-between bg-white px-4 py-4 text-[9px] font-semibold tracking-[0.12em] text-black"
          >
            SAVE VIDEO
            <Download size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              void (async () => {
                const shared =
                  await shareBlob(
                    blob,
                    videoFilename(),
                  )

                if (!shared) {
                  onToast(
                    'VIDEO SHARING IS NOT AVAILABLE IN THIS BROWSER.',
                  )
                }
              })()
            }}
            className="flex items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.12em] text-white/62"
          >
            SHARE
            <Share2 size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              void saveLocal()
            }}
            className="flex items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.12em] text-white/62"
          >
            LOCAL GALLERY
            <Video size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(url)
              onDiscard()
            }}
            className="flex items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.12em] text-white/42"
          >
            DISCARD
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Sheet>
  )
}