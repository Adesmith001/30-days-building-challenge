import { Sheet } from '../ui/Sheet'

interface Props {
  page:
    | 'about'
    | 'privacy'

  onClose(): void
}

export function InfoPanel({
  page,
  onClose,
}: Props) {
  if (page === 'privacy') {
    return (
      <Sheet
        title="PRIVACY"
        onClose={onClose}
      >
        <div className="px-5 pb-10 pt-7">
          <h2 className="text-5xl leading-[0.9] font-medium tracking-[-0.05em]">
            YOUR CAMERA
            <br />
            IS YOURS.
          </h2>

          <div className="mt-10 space-y-5 text-[10px] tracking-[0.13em] text-white/52">
            <p>
              CAMERA
              <br />↓
            </p>

            <p>
              YOUR BROWSER
              <br />↓
            </p>

            <p>
              LIGHT PAINTER
              <br />↓
            </p>

            <p>
              YOUR SCREEN / EXPORT
            </p>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-[9px] leading-6 tracking-[0.12em] text-white/38">
            <p>NO SERVER FRAME UPLOAD</p>
            <p>NO MICROPHONE REQUIRED</p>
            <p>
              EXPORT ONLY WHEN YOU CHOOSE
            </p>
          </div>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet
      title="ABOUT"
      onClose={onClose}
    >
      <div className="px-5 pb-10 pt-7">
        <h2 className="text-5xl leading-[0.9] font-medium tracking-[-0.05em]">
          NOT A LONG
          <br />
          SHUTTER.
        </h2>

        <p className="mt-7 text-sm leading-6 text-white/48">
          A physical long-exposure
          camera leaves the shutter open.
          Light Painter simulates the
          effect digitally by processing
          successive video frames and
          accumulating selected light and
          motion over time.
        </p>

        <div className="mt-10 space-y-3 text-[9px] tracking-[0.14em] text-white/44">
          <p>CAMERA FRAME</p>
          <p>↓</p>
          <p>BRIGHTNESS + MOTION</p>
          <p>↓</p>
          <p>MASK</p>
          <p>↓</p>
          <p>TEMPORAL ACCUMULATION</p>
          <p>↓</p>
          <p>FINAL IMAGE</p>
        </div>

        <p className="mt-10 text-[9px] leading-5 tracking-[0.12em] text-white/30">
          STANDARD PROCESSING HAPPENS
          LOCALLY IN YOUR BROWSER.
        </p>
      </div>
    </Sheet>
  )
}