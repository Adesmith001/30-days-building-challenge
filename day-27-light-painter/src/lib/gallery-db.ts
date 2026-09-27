export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  blob: Blob
  createdAt: number
  mode: string
  duration?: number
}

const DB_NAME = 'light-painter'
const STORE = 'gallery'
const VERSION = 1

function openDb() {
  return new Promise<IDBDatabase>(
    (resolve, reject) => {
      const request =
        indexedDB.open(
          DB_NAME,
          VERSION,
        )

      request.onupgradeneeded = () => {
        const db = request.result

        if (
          !db.objectStoreNames.contains(
            STORE,
          )
        ) {
          db.createObjectStore(STORE, {
            keyPath: 'id',
          })
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    },
  )
}

export async function saveGalleryItem(
  item: Omit<GalleryItem, 'id' | 'createdAt'>,
) {
  const db = await openDb()

  const value: GalleryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }

  await new Promise<void>(
    (resolve, reject) => {
      const transaction = db.transaction(
        STORE,
        'readwrite',
      )

      transaction
        .objectStore(STORE)
        .put(value)

      transaction.oncomplete = () =>
        resolve()

      transaction.onerror = () =>
        reject(transaction.error)
    },
  )

  db.close()

  return value
}

export async function listGallery() {
  const db = await openDb()

  const items =
    await new Promise<GalleryItem[]>(
      (resolve, reject) => {
        const request = db
          .transaction(STORE)
          .objectStore(STORE)
          .getAll()

        request.onsuccess = () => {
          resolve(
            (
              request.result as GalleryItem[]
            ).sort(
              (a, b) =>
                b.createdAt -
                a.createdAt,
            ),
          )
        }

        request.onerror = () =>
          reject(request.error)
      },
    )

  db.close()

  return items
}

export async function deleteGalleryItem(
  id: string,
) {
  const db = await openDb()

  await new Promise<void>(
    (resolve, reject) => {
      const transaction = db.transaction(
        STORE,
        'readwrite',
      )

      transaction
        .objectStore(STORE)
        .delete(id)

      transaction.oncomplete = () =>
        resolve()

      transaction.onerror = () =>
        reject(transaction.error)
    },
  )

  db.close()
}