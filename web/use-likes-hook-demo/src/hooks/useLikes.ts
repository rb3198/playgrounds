import { useCallback, useRef, useState } from "react";

export interface UseLikesHookProps {
  postId: number;
  mutate: (postId: number, liked: boolean) => Promise<boolean>;
  setLikedState: (liked: boolean) => unknown;
  onError?: (error: Error | unknown) => unknown;
}
export const useLikes = (props: UseLikesHookProps) => {
  const { mutate, postId, setLikedState, onError } = props;
  const queueRef = useRef<("like" | "dislike")[]>([]);
  const [processing, setProcessing] = useState(false);
  const processQueue = useCallback(async () => {
    console.log("Process Queue called", queueRef.current);
    setProcessing(true);
    const initialQueueLength = queueRef.current.length;
    const queueCopy = [...queueRef.current]; // Copy of the ref to not mutate the ref while processing.
    let finalAction: "like" | "dislike" | "none" = "none";
    while (queueCopy.length) {
      const type = queueCopy.shift();
      if (type === "like") {
        // @ts-ignore
        finalAction = finalAction === "dislike" ? "none" : "like";
      } else {
        // @ts-ignore
        finalAction = finalAction === "like" ? "none" : "dislike";
      }
    }
    if (finalAction === "none") {
      queueRef.current = queueRef.current.slice(initialQueueLength);
      if (queueRef.current.length > 0) {
        await processQueue();
      }
      setProcessing(false);
      return;
    }
    let execSuccess = false;
    try {
      execSuccess = await mutate(postId, finalAction === "like");
    } catch (error) {
      execSuccess = false;
      onError && onError(error);
    } finally {
      // Discard the items already processed.
      queueRef.current = queueRef.current.slice(initialQueueLength);
      if (queueRef.current.length > 0) {
        // Process the queue again if non-empty.
        // User actions were pushed to the queue while the call was being made
        if (!execSuccess) {
          /* Pop the first item if the call was unsuccessful due to
            the alternate nature of our actions */
          queueRef.current.shift();
        }
        await processQueue();
      } else if (execSuccess) {
        setLikedState(finalAction === "like");
      } else {
        setLikedState(finalAction !== "like");
      }
      setProcessing(false);
    }
  }, [postId, mutate, onError, setLikedState]);

  const pushToQueue = useCallback(
    (action: "like" | "dislike") => {
      const newQueue = [...queueRef.current, action];
      queueRef.current = newQueue;
      if (!processing) processQueue();
    },
    [processing, processQueue]
  );

  return [pushToQueue];
};
