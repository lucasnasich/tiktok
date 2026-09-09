import { useCallback, useMemo, useState } from "react";

import type { InspirationFeedItem } from "@/content/inspiration-feed";

export type InspirationVote = "like" | "dislike";

const STORAGE_KEY = "mercantis-inspiration-votes";

function readVotes(): Record<string, InspirationVote> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, InspirationVote>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeVotes(votes: Record<string, InspirationVote>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

export function useInspirationSwipe(items: InspirationFeedItem[]) {
  const [votes, setVotes] = useState<Record<string, InspirationVote>>(readVotes);

  const pendingItems = useMemo(
    () => items.filter((item) => !votes[item.key]),
    [items, votes],
  );

  const current = pendingItems[0] ?? null;
  const next = pendingItems[1] ?? null;

  const likedCount = useMemo(
    () => Object.values(votes).filter((vote) => vote === "like").length,
    [votes],
  );

  const dislikedCount = useMemo(
    () => Object.values(votes).filter((vote) => vote === "dislike").length,
    [votes],
  );

  const vote = useCallback(
    (choice: InspirationVote) => {
      if (!current) return;

      setVotes((prev) => {
        const nextVotes = { ...prev, [current.key]: choice };
        writeVotes(nextVotes);
        return nextVotes;
      });
    },
    [current],
  );

  const resetVotes = useCallback(() => {
    writeVotes({});
    setVotes({});
  }, []);

  const reviewedCount = items.length - pendingItems.length;
  const isComplete = items.length > 0 && pendingItems.length === 0;
  const progressLabel = items.length
    ? `${Math.min(reviewedCount + (isComplete ? 0 : 1), items.length)} / ${items.length}`
    : "0 / 0";

  return {
    current,
    next,
    vote,
    resetVotes,
    likedCount,
    dislikedCount,
    reviewedCount,
    pendingCount: pendingItems.length,
    totalCount: items.length,
    isComplete,
    progressLabel,
  };
}
