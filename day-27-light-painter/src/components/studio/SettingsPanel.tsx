import {
  Camera,
  Check,
  CircleGauge,
  Flame,
  Focus,
  GalleryHorizontalEnd,
  RotateCcw,
  Scan,
  Snowflake,
  Video,
} from 'lucide-react'

import type {
  MediaSourceController,
} from '../../hooks/use-media-source'

import {
  MODE_DESCRIPTION,
  NEON_COLORS,
} from '../../lib/constants'

import {
  decayLabel,
} from '../../lib/presets'

import type {
  PainterSettings,
  PresetName,
  SettingsTab,
} from '../../types/painter'

import { RangeRow } from '../ui/RangeRow'
import { Sheet } from '../ui/Sheet'

interface Props {
  tab: SettingsTab
  settings: PainterSettings
  preset: PresetName
  autoQuality: boolean

  media: MediaSourceController

  onClose(): void

  onPatch(
    patch: Partial<PainterSettings>,
  ): void

  onPreset(
    preset: PresetName,
  ): void

  onFreeze(): void
  onCheckpoint(): void
  onRestore(): void

  onEngine(): void
  onGallery(): void
  onRecord(): void
  onFocus(): void
  onCalibrate(): void

  onAutoQuality(
    enabled: boolean,
  ): void
}

function Segment({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick(): void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'border px-3 py-3 text-[9px] tracking-[0.12em]',
        active
          ? 'border-white bg-white text-black'
          : 'border-white/10 text-white/54 hover:border-white/24 hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function SettingsPanel({
  tab,
  settings,
  preset,
  autoQuality,
  media,
  onClose,
  onPatch,
  onPreset,
  onFreeze,
  onCheckpoint,
  onRestore,
  onEngine,
  onGallery,
  onRecord,
  onFocus,
  onCalibrate,
  onAutoQuality,
}: Props) {
  const title =
    tab === 'mode'
      ? 'MODE'
      : tab === 'exposure'
        ? 'EXPOSURE'
        : 'MORE'

  return (
    <Sheet
      title={title}
      onClose={onClose}
    >
      <div className="px-5 pb-10">
        {tab === 'mode' && (
          <>
            <p className="pt-6 text-[9px] tracking-[0.18em] text-white/34">
              PAINT MODE
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(
                [
                  'light',
                  'ghost',
                  'color',
                  'neon',
                ] as const
              ).map((mode) => (
                <Segment
                  key={mode}
                  active={
                    settings.mode ===
                    mode
                  }
                  onClick={() => {
                    onPatch({
                      mode,
                    })
                  }}
                >
                  {mode.toUpperCase()}
                </Segment>
              ))}
            </div>

            <p className="mt-4 text-[10px] leading-5 tracking-[0.1em] text-white/42">
              {
                MODE_DESCRIPTION[
                  settings.mode
                ]
              }
            </p>

            <p className="mt-8 text-[9px] tracking-[0.18em] text-white/34">
              PRESETS
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(
                [
                  'write',
                  'portrait',
                  'trails',
                  'ghost',
                  'neon',
                ] as const
              ).map((item) => (
                <Segment
                  key={item}
                  active={
                    preset === item
                  }
                  onClick={() =>
                    onPreset(item)
                  }
                >
                  {item.toUpperCase()}
                </Segment>
              ))}
            </div>

            {settings.mode ===
              'neon' && (
              <>
                <p className="mt-8 text-[9px] tracking-[0.18em] text-white/34">
                  TRAIL COLOR
                </p>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {NEON_COLORS.map(
                    (color) => (
                      <button
                        key={color.value}
                        type="button"
                        title={color.name}
                        onClick={() =>
                          onPatch({
                            neonColor:
                              color.value,
                          })
                        }
                        className="relative aspect-square border border-white/10"
                      >
                        <span
                          className="absolute inset-2"
                          style={{
                            background:
                              color.value,
                          }}
                        />

                        {settings.neonColor ===
                          color.value && (
                          <Check
                            size={13}
                            className="absolute right-1 top-1 mix-blend-difference"
                          />
                        )}
                      </button>
                    ),
                  )}
                </div>

                <input
                  type="color"
                  aria-label="Custom trail colour"
                  value={
                    settings.neonColor
                  }
                  onChange={(
                    event,
                  ) => {
                    onPatch({
                      neonColor:
                        event.target
                          .value,
                    })
                  }}
                  className="mt-3 h-10 w-full cursor-pointer bg-transparent"
                />
              </>
            )}
          </>
        )}

        {tab === 'exposure' && (
          <>
            <div className="pt-2">
              <RangeRow
                label={`TRAIL LENGTH · ${decayLabel(
                  settings.trailDecay,
                )}`}
                value={
                  settings.trailDecay
                }
                min={0.89}
                max={1}
                step={0.001}
                left="SHORT"
                right="PERMANENT"
                onChange={(
                  trailDecay,
                ) =>
                  onPatch({
                    trailDecay,
                  })
                }
              />

              <RangeRow
                label="LIGHT SENSITIVITY"
                value={
                  0.82 -
                  settings.brightnessThreshold
                }
                min={0.06}
                max={0.58}
                left="LOW"
                right="HIGH"
                onChange={(
                  value,
                ) =>
                  onPatch({
                    brightnessThreshold:
                      0.82 - value,
                  })
                }
              />

              <RangeRow
                label="MOTION"
                value={
                  0.2 -
                  settings.motionThreshold
                }
                min={0.02}
                max={0.17}
                left="STABLE"
                right="SENSITIVE"
                onChange={(
                  value,
                ) =>
                  onPatch({
                    motionThreshold:
                      0.2 - value,
                  })
                }
              />

              <RangeRow
                label="STRENGTH"
                value={
                  settings.strength
                }
                min={0.15}
                max={1}
                left="SUBTLE"
                right="BRIGHT"
                onChange={(
                  strength,
                ) =>
                  onPatch({
                    strength,
                  })
                }
              />

              <RangeRow
                label="GLOW"
                value={
                  settings.glow
                }
                min={0}
                max={1}
                left="OFF"
                right="HIGH"
                onChange={(
                  glow,
                ) =>
                  onPatch({
                    glow,
                  })
                }
              />
            </div>

            <button
              type="button"
              onClick={onCalibrate}
              className="mt-5 flex w-full items-center justify-between border border-white/12 px-4 py-4 text-[9px] tracking-[0.13em] text-white/62 hover:bg-white/5 hover:text-white"
            >
              AUTO CALIBRATE
              <Scan size={14} />
            </button>
          </>
        )}

        {tab === 'more' && (
          <>
            <p className="pt-6 text-[9px] tracking-[0.18em] text-white/34">
              BACKGROUND
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(
                [
                  'camera',
                  'frozen',
                  'black',
                ] as const
              ).map((background) => (
                <Segment
                  key={background}
                  active={
                    settings.background ===
                    background
                  }
                  onClick={() => {
                    if (
                      background ===
                      'frozen'
                    ) {
                      onFreeze()
                    } else {
                      onPatch({
                        background,
                      })
                    }
                  }}
                >
                  {background.toUpperCase()}
                </Segment>
              ))}
            </div>

            <RangeRow
              label="BACKGROUND OPACITY"
              value={
                settings.backgroundOpacity
              }
              min={0}
              max={1}
              left="0"
              right="100"
              onChange={(
                backgroundOpacity,
              ) =>
                onPatch({
                  backgroundOpacity,
                })
              }
            />

            <p className="mt-6 text-[9px] tracking-[0.18em] text-white/34">
              CAMERA
            </p>

            {media.devices.length >
              0 && (
              <div className="mt-4 space-y-2">
                {media.devices.map(
                  (device, index) => (
                    <button
                      key={
                        device.deviceId
                      }
                      type="button"
                      onClick={() => {
                        void media.openCamera(
                          device.deviceId,
                        )
                      }}
                      className={[
                        'flex w-full items-center justify-between border px-4 py-3 text-left text-[9px] tracking-[0.1em]',
                        media.selectedDeviceId ===
                        device.deviceId
                          ? 'border-white/48 text-white'
                          : 'border-white/10 text-white/48',
                      ].join(' ')}
                    >
                      <span>
                        {device.label ||
                          `CAMERA ${
                            index + 1
                          }`}
                      </span>

                      <Camera
                        size={13}
                      />
                    </button>
                  ),
                )}
              </div>
            )}

            {media.torchSupported && (
              <button
                type="button"
                onClick={() => {
                  void media.toggleTorch()
                }}
                className="mt-2 flex w-full items-center justify-between border border-white/10 px-4 py-3 text-[9px] tracking-[0.1em] text-white/56"
              >
                TORCH{' '}
                {media.torchOn
                  ? 'ON'
                  : 'OFF'}

                <Flame size={13} />
              </button>
            )}

            <div className="mt-8 grid grid-cols-2 gap-2">
              <Segment
                active={settings.mirror}
                onClick={() =>
                  onPatch({
                    mirror:
                      !settings.mirror,
                  })
                }
              >
                MIRROR{' '}
                {settings.mirror
                  ? 'ON'
                  : 'OFF'}
              </Segment>

              <Segment
                active={
                  settings.timeColor
                }
                onClick={() =>
                  onPatch({
                    timeColor:
                      !settings.timeColor,
                  })
                }
              >
                TIME COLOR
              </Segment>
            </div>

            <p className="mt-8 text-[9px] tracking-[0.18em] text-white/34">
              SYMMETRY
            </p>

            <select
              value={
                settings.symmetry
              }
              onChange={(event) => {
                onPatch({
                  symmetry:
                    event.target
                      .value as PainterSettings['symmetry'],
                })
              }}
              className="mt-3 w-full border border-white/12 bg-black px-4 py-3 text-[9px] tracking-[0.12em] text-white/70"
            >
              <option value="none">
                NONE
              </option>
              <option value="mirror-x">
                MIRROR X
              </option>
              <option value="mirror-y">
                MIRROR Y
              </option>
              <option value="quad">
                QUAD
              </option>
            </select>

            <p className="mt-8 text-[9px] tracking-[0.18em] text-white/34">
              CREATION
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onFocus}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                FOCUS
                <Focus size={13} />
              </button>

              <button
                type="button"
                onClick={onCheckpoint}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                CHECKPOINT
                <Snowflake size={13} />
              </button>

              <button
                type="button"
                onClick={onRestore}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                RESTORE
                <RotateCcw size={13} />
              </button>

              <button
                type="button"
                onClick={onRecord}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                RECORD
                <Video size={13} />
              </button>

              <button
                type="button"
                onClick={onEngine}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                ENGINE
                <CircleGauge size={13} />
              </button>

              <button
                type="button"
                onClick={onGallery}
                className="flex items-center justify-between border border-white/10 px-4 py-4 text-[9px] tracking-[0.12em] text-white/58"
              >
                GALLERY
                <GalleryHorizontalEnd
                  size={13}
                />
              </button>
            </div>

            <p className="mt-8 text-[9px] tracking-[0.18em] text-white/34">
              PROCESSING
            </p>

            <label className="mt-3 flex items-center justify-between border border-white/10 px-4 py-3 text-[9px] tracking-[0.1em] text-white/58">
              AUTO QUALITY

              <input
                type="checkbox"
                checked={autoQuality}
                onChange={(event) =>
                  onAutoQuality(
                    event.target.checked,
                  )
                }
              />
            </label>

            {!autoQuality && (
              <select
                value={
                  settings.quality
                }
                onChange={(event) =>
                  onPatch({
                    quality:
                      event.target
                        .value as PainterSettings['quality'],
                  })
                }
                className="mt-2 w-full border border-white/12 bg-black px-4 py-3 text-[9px] tracking-[0.12em] text-white/70"
              >
                <option value="high">
                  HIGH
                </option>
                <option value="balanced">
                  BALANCED
                </option>
                <option value="low">
                  LOW
                </option>
              </select>
            )}
          </>
        )}
      </div>
    </Sheet>
  )
}
