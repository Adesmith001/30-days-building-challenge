/* eslint-disable react-hooks/set-state-in-effect */
import {
  Download,
  Share2,
  Trash2,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  deleteGalleryItem,
  type GalleryItem,
  listGallery,
} from '../../lib/gallery-db'

import {
  downloadBlob,
  imageFilename,
  shareBlob,
  videoFilename,
} from '../../lib/export'

import { Sheet } from '../ui/Sheet'

interface Row {
  item: GalleryItem
  url: string
}

interface Props {
  onClose(): void
}

export function GalleryPanel({
  onClose,
}: Props) {
  const [rows, setRows] =
    useState<Row[]>([])

  const load = async () => {
    rows.forEach((row) => {
      URL.revokeObjectURL(row.url)
    })

    const items =
      await listGallery()

    setRows(
      items.map((item) => ({
        item,
        url: URL.createObjectURL(
          item.blob,
        ),
      })),
    )
  }

  useEffect(() => {
    void load()

    return () => {
      rows.forEach((row) => {
        URL.revokeObjectURL(row.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Sheet
      title="YOUR PAINTINGS"
      onClose={onClose}
      wide
    >
      <div className="p-5">
        <p className="mb-5 text-[9px] tracking-[0.14em] text-white/32">
          SAVED ON THIS DEVICE
        </p>

        {rows.length === 0 && (
          <div className="grid min-h-64 place-items-center border border-white/9 text-center">
            <p className="text-[9px] tracking-[0.14em] text-white/30">
              NO SAVED PAINTINGS YET.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {rows.map(
            ({ item, url }) => (
              <article
                key={item.id}
                className="border border-white/10"
              >
                {item.type ===
                'image' ? (
                  <img
                    src={url}
                    alt="Saved light painting"
                    className="aspect-square w-full bg-black object-cover"
                  />
                ) : (
                  <video
                    src={url}
                    muted
                    playsInline
                    controls
                    className="aspect-square w-full bg-black object-cover"
                  />
                )}

                <div className="p-3">
                  <div className="flex items-center justify-between text-[8px] tracking-[0.1em] text-white/36">
                    <span>
                      {item.mode.toUpperCase()}
                    </span>

                    <span>
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        downloadBlob(
                          item.blob,
                          item.type ===
                            'image'
                            ? imageFilename()
                            : videoFilename(),
                        )
                      }
                      className="grid size-8 place-items-center border border-white/10 text-white/50"
                    >
                      <Download size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void shareBlob(
                          item.blob,
                          item.type ===
                            'image'
                            ? imageFilename()
                            : videoFilename(),
                        )
                      }}
                      className="grid size-8 place-items-center border border-white/10 text-white/50"
                    >
                      <Share2 size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await deleteGalleryItem(
                            item.id,
                          )

                          await load()
                        })()
                      }}
                      className="ml-auto grid size-8 place-items-center border border-white/10 text-white/34 hover:text-white"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>

        <p className="mt-7 text-[8px] leading-5 tracking-[0.11em] text-white/24">
          GALLERY DATA LIVES IN
          INDEXEDDB. CLEARING BROWSER
          STORAGE MAY REMOVE IT.
        </p>
      </div>
    </Sheet>
  )
}