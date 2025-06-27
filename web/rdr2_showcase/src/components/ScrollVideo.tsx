import React, { useRef, useEffect, useCallback } from "react";
import { Subscribe, Unsubscribe } from "../types";

export interface ScrollVideoProps {
  yBounds: [number, number];
  videoAddress: string;
  canvasWidth: number;
  canvasHeight: number;
  visible?: boolean;
  canvasClasses?: string;
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
}

export const ScrollVideo: React.FC<ScrollVideoProps> = ({
  subscribe,
  unsubscribe,
  yBounds,
  videoAddress,
  canvasWidth,
  canvasHeight,
  canvasClasses,
  visible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastRequestedTimeRef = useRef<number | null>(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { videoWidth, videoHeight } = video;
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const videoAspect = videoWidth / videoHeight;
    const canvasAspect = canvasWidth / canvasHeight;
    let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

    if (videoAspect > canvasAspect) {
      // Video is wider than canvas
      drawHeight = canvasHeight;
      drawWidth = drawHeight * videoAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Video is taller than canvas
      drawWidth = canvasWidth;
      drawHeight = drawWidth / videoAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Draw video frame to canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const updateVideoFrame = useCallback(
    (yOffset: number) => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.duration) return;

      const range = yBounds[1] - yBounds[0];
      const clampedProgress = Math.max(
        0,
        Math.min(1, (yOffset - yBounds[0]) / range)
      );
      const targetTime = video.duration * clampedProgress;

      // Skip if we're already close to this time
      if (
        lastRequestedTimeRef.current !== null &&
        Math.abs(targetTime - lastRequestedTimeRef.current) < 0.01
      ) {
        return;
      }

      lastRequestedTimeRef.current = targetTime;
      video.currentTime = targetTime;

      // Use requestVideoFrameCallback if available
      if ("requestVideoFrameCallback" in video) {
        video.requestVideoFrameCallback(() => {
          drawFrame();
        });
      } else {
        // Fallback: wait for onseeked
        const handler = () => {
          drawFrame();
          (video as HTMLVideoElement).removeEventListener("seeked", handler);
        };
        (video as HTMLVideoElement).addEventListener("seeked", handler);
      }
    },
    [yBounds, drawFrame]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleMetadata = () => drawFrame();
    video.addEventListener("loadedmetadata", handleMetadata);
    return () => video.removeEventListener("loadedmetadata", handleMetadata);
  }, [drawFrame]);

  useEffect(() => {
    subscribe(updateVideoFrame);
    return () => {
      unsubscribe(updateVideoFrame);
    };
  }, [updateVideoFrame, subscribe, unsubscribe]);

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        src={videoAddress}
        preload="auto"
        muted
        playsInline
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className={canvasClasses}
        style={{ opacity: visible ? 1 : 0 }}
      />
    </div>
  );
};
