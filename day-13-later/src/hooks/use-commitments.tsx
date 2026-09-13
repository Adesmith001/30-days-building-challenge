import { useEffect, useState } from "react";

import { loadCommitments, saveCommitments } from "../lib/storage";
import type { Commitment } from "../types/commitment";

export function useCommitments() {
  const [commitments, setCommitments] = useState<Commitment[]>(() => refreshStatuses(loadCommitments()));

  useEffect(() => {
    saveCommitments(commitments);
  }, [commitments]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCommitments((current) => refreshStatuses(current));
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = commitments
      .filter((commitment) => commitment.status === "waiting")
      .map((commitment) =>
        window.setTimeout(() => {
          setCommitments((current) =>
            current.map((item) =>
              item.id === commitment.id && item.status !== "completed"
                ? { ...item, status: "due" }
                : item,
            ),
          );

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Later is now", {
              body: commitment.title,
            });
          }
        }, Math.max(0, commitment.scheduledFor - Date.now())),
      );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [commitments]);

  function createCommitment(title: string, scheduledFor: number) {
    const commitment: Commitment = {
      id: crypto.randomUUID(),
      title,
      createdAt: Date.now(),
      scheduledFor,
      originalScheduledFor: scheduledFor,
      status: scheduledFor <= Date.now() ? "due" : "waiting",
      postponements: 0,
      history: [],
    };

    setCommitments((current) => [...current, commitment]);
    return commitment;
  }

  function completeCommitment(id: string) {
    setCommitments((current) =>
      current.map((commitment) =>
        commitment.id === id
          ? { ...commitment, status: "completed", completedAt: Date.now() }
          : commitment,
      ),
    );
  }

  function postponeCommitment(id: string, scheduledFor: number) {
    setCommitments((current) =>
      current.map((commitment) =>
        commitment.id === id
          ? {
              ...commitment,
              scheduledFor,
              status: scheduledFor <= Date.now() ? "due" : "waiting",
              postponements: commitment.postponements + 1,
              history: [
                ...commitment.history,
                { from: commitment.scheduledFor, to: scheduledFor, changedAt: Date.now() },
              ],
            }
          : commitment,
      ),
    );
  }

  function updateCommitment(id: string, title: string, scheduledFor: number) {
    setCommitments((current) =>
      current.map((commitment) => {
        if (commitment.id !== id) return commitment;

        const changedTime = commitment.scheduledFor !== scheduledFor;

        return {
          ...commitment,
          title,
          scheduledFor,
          status: scheduledFor <= Date.now() ? "due" : "waiting",
          history: changedTime
            ? [...commitment.history, { from: commitment.scheduledFor, to: scheduledFor, changedAt: Date.now() }]
            : commitment.history,
        };
      }),
    );
  }

  function deleteCommitment(id: string) {
    setCommitments((current) => current.filter((commitment) => commitment.id !== id));
  }

  function getCommitment(id: string) {
    return commitments.find((commitment) => commitment.id === id);
  }

  return {
    commitments,
    createCommitment,
    completeCommitment,
    postponeCommitment,
    updateCommitment,
    deleteCommitment,
    getCommitment,
  };
}

function refreshStatuses(commitments: Commitment[]) {
  const now = Date.now();

  return commitments.map((commitment): Commitment => {
    if (commitment.status === "completed") {
      return commitment;
    }

    return {
      ...commitment,
      status: commitment.scheduledFor <= now ? "due" : "waiting",
    };
  });
}
