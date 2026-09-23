"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import type {
  Conversation,
} from "@/types/chat";

import {
  AppSidebar,
} from "@/components/sidebar/app-sidebar";

interface ShellContextValue {
  openMobile:
    () => void;
}

const ShellContext =
  createContext<
    ShellContextValue | undefined
  >(undefined);

export function useAppShell() {
  const context =
    useContext(
      ShellContext,
    );

  if (!context) {
    throw new Error(
      "useAppShell must be used inside AppShell",
    );
  }

  return context;
}

interface Props {
  conversations:
    Conversation[];

  name?: string | null;
  email?: string | null;

  children:
    React.ReactNode;
}

export function AppShell({
  conversations,
  name,
  email,
  children,
}: Props) {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollapsed(
        window.localStorage.getItem(
          "sidebar-collapsed",
        ) === "true",
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function toggleCollapse() {
    setCollapsed(
      (value) => {
        const next =
          !value;

        window.localStorage.setItem(
          "sidebar-collapsed",
          String(next),
        );

        return next;
      },
    );
  }

  return (
    <ShellContext.Provider
      value={{
        openMobile: () =>
          setMobileOpen(
            true,
          ),
      }}
    >
      <div
        className="
          flex h-dvh
          overflow-hidden
        "
      >
        <div
          className="
            hidden md:block
          "
        >
          <AppSidebar
            conversations={
              conversations
            }
            name={name}
            email={email}
            collapsed={
              collapsed
            }
            onCollapse={
              toggleCollapse
            }
          />
        </div>

        {mobileOpen && (
          <div
            className="
              fixed inset-0
              z-50 flex
              md:hidden
            "
          >
            <div
              className="
                absolute inset-0
                bg-black/20
              "
              onClick={() =>
                setMobileOpen(
                  false,
                )
              }
            />

            <div
              className="
                relative h-full
                w-[min(88vw,320px)]
              "
            >
              <AppSidebar
                conversations={
                  conversations
                }
                name={name}
                email={email}
                onCloseMobile={() =>
                  setMobileOpen(
                    false,
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(
                    false,
                  )
                }
                className="
                  absolute
                  right-3 top-3
                  rounded-md p-2
                  md:hidden
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div
          className="
            min-w-0 flex-1
          "
        >
          {children}
        </div>
      </div>
    </ShellContext.Provider>
  );
}
