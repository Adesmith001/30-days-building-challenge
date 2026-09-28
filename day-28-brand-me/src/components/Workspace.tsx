import {
    ArrowLeft,
    Boxes,
    Code2,
    Component,
    Download,
    Moon,
    Palette,
    Redo2,
    Shuffle,
    Sparkles,
    Sun,
    Type,
    Undo2,
    Upload,
} from "lucide-react"
import {
    useEffect,
    useMemo,
    useState,
} from "react"
import type {
    BrandProject,
    WorkspaceView,
} from "../types"
import {
    generateBrandSystem,
} from "../lib/generate"
import {
    systemVariables,
} from "../lib/css-vars"
import {
    loadFont,
} from "../data/fonts"
import {
    useBrandStore,
} from "../store/brand-store"
import {
    DNAPanel,
} from "./DNAPanel"
import {
    Preview,
} from "./Preview"
import {
    PaletteView,
} from "./PaletteView"
import {
    TypographyView,
} from "./TypographyView"
import {
    ComponentLab,
} from "./ComponentLab"
import {
    TokensView,
} from "./TokensView"
import {
    StressView,
} from "./StressView"
import {
    ExportView,
} from "./ExportView"
import {
    CompareModal,
} from "./CompareModal"
import {
    CommandPalette,
} from "./CommandPalette"
import { SlidersHorizontal } from "lucide-react"

const navigation: {
    view: WorkspaceView
    label: string
    icon: React.ElementType
}[] = [
        {
            view: "preview",
            label: "PREVIEW",
            icon: Sparkles,
        },
        {
            view: "palette",
            label: "PALETTE",
            icon: Palette,
        },
        {
            view: "type",
            label: "TYPE",
            icon: Type,
        },
        {
            view: "components",
            label: "COMPONENTS",
            icon: Component,
        },
        {
            view: "tokens",
            label: "TOKENS",
            icon: Code2,
        },
        {
            view: "stress",
            label: "STRESS TEST",
            icon: Boxes,
        },
    ]

export function Workspace({
    onExit,
}: {
    onExit: () => void
}) {
    const project =
        useBrandStore((state) => state.project)

    const past =
        useBrandStore((state) => state.past)

    const showBefore =
        useBrandStore(
            (state) => state.showBefore,
        )

    const view =
        useBrandStore((state) => state.view)

    const setView =
        useBrandStore((state) => state.setView)

    const previewMode =
        useBrandStore(
            (state) => state.previewMode,
        )

    const setPreviewMode =
        useBrandStore(
            (state) => state.setPreviewMode,
        )

    const theme =
        useBrandStore((state) => state.theme)

    const toggleTheme =
        useBrandStore(
            (state) => state.toggleTheme,
        )

    const undo =
        useBrandStore((state) => state.undo)

    const redo =
        useBrandStore((state) => state.redo)

    const remix =
        useBrandStore((state) => state.remix)

    const future = useBrandStore((state) => state.future)

    const [compare, setCompare] = useState(false)

    const [mobileDNA, setMobileDNA] = useState(false)

    const activeProject =
        showBefore && past.length > 0
            ? past.at(-1)!
            : project

    const system = useMemo(
        () =>
            activeProject
                ? generateBrandSystem(
                    activeProject,
                )
                : null,
        [activeProject],
    )

    useEffect(() => {
        if (!system) {
            return
        }

        loadFont(
            system.typography.heading.family,
            system.typography.heading.weights,
        )

        loadFont(
            system.typography.body.family,
            system.typography.body.weights,
        )

        loadFont(
            system.typography.mono.family,
            system.typography.mono.weights,
        )
    }, [system])

    if (!project || !system) {
        return null
    }

    const vars = systemVariables(
        system,
        theme,
    )

    async function importBrandFile(
        file: File,
    ) {
        try {
            const text =
                await file.text()

            const imported =
                JSON.parse(text) as BrandProject

            if (
                !imported.id ||
                !imported.dna ||
                !imported.seed ||
                !imported.generatorVersion
            ) {
                throw new Error(
                    "Unsupported brand file.",
                )
            }

            useBrandStore
                .getState()
                .setProject({
                    ...imported,
                    id: crypto.randomUUID(),
                    updatedAt: Date.now(),
                })
        } catch {
            alert(
                "This Brand Me file could not be opened.",
            )
        }
    }

    return (
        <main className="h-screen overflow-hidden bg-[#ebeae6] text-[#181815]">
            <header className="flex h-14 items-center border-b border-black/10 bg-[#f7f6f2]">
                <button
                    onClick={onExit}
                    className="flex h-full w-14 items-center justify-center border-r border-black/10"
                >
                    <ArrowLeft size={15} />
                </button>

                <div className="flex h-full min-w-0 flex-1 items-center justify-between px-4">
                    <div className="min-w-0">
                        <div className="truncate text-xs font-black">
                            {project.name.toUpperCase()}
                        </div>

                        <div className="text-[8px] font-bold tracking-[0.1em] text-black/35">
                            BRAND ME · V1
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={undo}
                            disabled={past.length === 0}
                            className="editor-icon-button disabled:opacity-20"
                        >
                            <Undo2 size={14} />
                        </button>

                        <button
                            onClick={redo}
                            disabled={future.length === 0}
                            className="editor-icon-button disabled:opacity-20"
                        >
                            <Redo2 size={14} />
                        </button>

                        <button
                            onClick={remix}
                            className="editor-icon-button hidden sm:flex"
                        >
                            <Shuffle size={14} />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="editor-icon-button"
                        >
                            {theme === "light" ? (
                                <Moon size={14} />
                            ) : (
                                <Sun size={14} />
                            )}
                        </button>

                        {project.variants.length > 1 && (
                            <button
                                onClick={() =>
                                    setCompare(true)
                                }
                                className="editor-button hidden md:flex"
                            >
                                COMPARE
                            </button>
                        )}

                        <button
                            onClick={() =>
                                setView("export")
                            }
                            className="editor-button"
                        >
                            <Download size={13} />
                            EXPORT
                        </button>

                        <label className="editor-icon-button hidden cursor-pointer md:flex">
                            <Upload size={14} />

                            <input
                                type="file"
                                accept=".json,.brandme"
                                className="hidden"
                                onChange={(event) => {
                                    const file =
                                        event.target.files?.[0]

                                    if (file) {
                                        importBrandFile(file)
                                    }

                                    event.target.value = ""
                                }}
                            />
                        </label>
                    </div>
                </div>
            </header>

            <div className="grid h-[calc(100vh-3.5rem)] md:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[72px_minmax(0,1fr)_330px]">
                <aside className="hidden border-r border-black/10 bg-[#f7f6f2] py-3 md:flex md:flex-col md:items-center">
                    {navigation.map(
                        ({
                            view: itemView,
                            label,
                            icon: Icon,
                        }) => (
                            <button
                                key={itemView}
                                onClick={() =>
                                    setView(itemView)
                                }
                                title={label}
                                className={
                                    view === itemView
                                        ? "mb-1 flex h-12 w-12 items-center justify-center bg-black text-white"
                                        : "mb-1 flex h-12 w-12 items-center justify-center text-black/45 hover:bg-black/5 hover:text-black"
                                }
                            >
                                <Icon size={16} />
                            </button>
                        ),
                    )}
                </aside>

                <section className="min-w-0 overflow-y-auto">
                    {view === "preview" && (
                        <>
                            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-[#f7f6f2]/95 px-3 py-2 backdrop-blur">
                                <div className="flex overflow-x-auto">
                                    {[
                                        "landing",
                                        "product",
                                        "dashboard",
                                        "mobile",
                                    ].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() =>
                                                setPreviewMode(
                                                    mode as typeof previewMode,
                                                )
                                            }
                                            className={
                                                previewMode === mode
                                                    ? "bg-black px-3 py-2 text-[9px] font-bold text-white"
                                                    : "px-3 py-2 text-[9px] font-bold text-black/40"
                                            }
                                        >
                                            {mode.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                <div className="hidden text-[9px] font-bold tracking-[0.1em] text-black/30 sm:block">
                                    LIVE PREVIEW
                                </div>
                            </div>

                            <div className="p-3 md:p-5">
                                <div
                                    className="overflow-hidden border border-black/15 shadow-[0_30px_100px_rgba(20,20,18,0.08)] transition-all"
                                    style={vars}
                                >
                                    <Preview
                                        system={system}
                                        mode={previewMode}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {view === "palette" && (
                        <PaletteView system={system} />
                    )}

                    {view === "type" && (
                        <TypographyView
                            system={system}
                        />
                    )}

                    {view === "components" && (
                        <div
                            className="min-h-full"
                            style={vars}
                        >
                            <ComponentLab
                                system={system}
                            />
                        </div>
                    )}

                    {view === "tokens" && (
                        <TokensView system={system} />
                    )}

                    {view === "stress" && (
                        <StressView system={system} />
                    )}

                    {view === "export" && (
                        <ExportView
                            project={project}
                            system={system}
                        />
                    )}
                </section>

                <div className="hidden min-h-0 xl:block">
                    <DNAPanel system={system} />
                </div>
            </div>

            <button
                onClick={() => setMobileDNA(true)}
                className="fixed bottom-[4.5rem] right-4 z-40 flex h-12 items-center gap-2 bg-black px-4 text-[10px] font-bold text-white shadow-xl xl:hidden"
            >
                <SlidersHorizontal size={14} />
                BRAND DNA
            </button>

            {mobileDNA && (
                <div className="fixed inset-0 z-[70] bg-black/30 xl:hidden">
                    <button
                        className="h-[13vh] w-full"
                        onClick={() => setMobileDNA(false)}
                        aria-label="Close DNA"
                    />

                    <div className="h-[87vh] overflow-y-auto bg-[#f7f6f2]">
                        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-black/10 bg-[#f7f6f2] px-5">
                            <span className="text-xs font-black">
                                BRAND DNA
                            </span>

                            <button
                                onClick={() => setMobileDNA(false)}
                                className="text-xs font-bold"
                            >
                                DONE
                            </button>
                        </div>

                        <DNAPanel system={system} />
                    </div>
                </div>
            )}

            <MobileBar />

            {compare && (
                <CompareModal
                    project={project}
                    onClose={() =>
                        setCompare(false)
                    }
                />
            )}

            <CommandPalette />
        </main>
    )
}

function MobileBar() {
    const view =
        useBrandStore((state) => state.view)

    const setView =
        useBrandStore((state) => state.setView)

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-black/10 bg-[#f7f6f2] md:hidden">
            {[
                ["preview", "PREVIEW"],
                ["palette", "COLOR"],
                ["tokens", "TOKENS"],
                ["export", "EXPORT"],
            ].map(([value, label]) => (
                <button
                    key={value}
                    onClick={() =>
                        setView(value as WorkspaceView)
                    }
                    className={
                        view === value
                            ? "h-14 bg-black text-[9px] font-bold text-white"
                            : "h-14 text-[9px] font-bold text-black/40"
                    }
                >
                    {label}
                </button>
            ))}
        </div>
    )
}