"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoomIframeProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function DoomIframe({
  width = "100%",
  height = "500px",
  className = "",
}: DoomIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [gameRunning, setGameRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerFullscreen = () => {
    if (!iframeRef.current) return;

    try {
      // Try to request fullscreen on the iframe
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).mozRequestFullScreen) {
        (iframeRef.current as any).mozRequestFullScreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) {
        (iframeRef.current as any).msRequestFullscreen();
      }

      // Also send a message to the iframe content to handle fullscreen internally if needed
      iframeRef.current.contentWindow?.postMessage(
        { type: "request-fullscreen" },
        "*"
      );
    } catch (err) {
      console.error("Error requesting fullscreen:", err);
      setError(
        "Fullscreen mode failed. Try using the in-game fullscreen button instead."
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle messages from the iframe
      if (event.data?.type === "doom-loading") {
        setLoading(true);
        setGameRunning(false);
      } else if (event.data?.type === "doom-running") {
        setLoading(false);
        setGameRunning(true);
      } else if (event.data?.type === "doom-fullscreen") {
        triggerFullscreen();
      } else if (event.data?.type === "doom-error") {
        setError(event.data.message || "An error occurred while loading DOOM");
        setLoading(false);
      }
    };

    // Listen for messages from the iframe
    window.addEventListener("message", handleMessage);

    // Send window size to iframe when component mounts or window resizes
    const sendSizeToIframe = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "resize",
            width: containerRef.current?.clientWidth,
            height: containerRef.current?.clientHeight,
          },
          "*"
        );
      }
    };

    // Initial size send
    setTimeout(sendSizeToIframe, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("resize", sendSizeToIframe);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <iframe
        ref={iframeRef}
        src="/game.html"
        width="100%"
        height="100%"
        className="relative z-[1]"
        style={{
          border: "none",
          backgroundColor: "#121212",
          borderRadius: "0.25rem",
        }}
        allowFullScreen
        title="DOOM Game"
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-[5] p-4">
          <p className="text-lg font-bold text-destructive mb-2 font-mono uppercase tracking-wider">SYSTEM FAILURE</p>
          <p className="text-sm text-muted-foreground text-center mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src;
              }
            }}
            variant="destructive"
            className="font-mono uppercase tracking-wider font-medium hover:translate-y-[-2px] transition-transform shadow-[0_0_0_1px_rgba(255,0,0,0.3)] hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]"
          >
            REBOOT SYSTEM
          </Button>
        </div>
      )}

      {gameRunning && !loading && !error && (
        <div className="absolute bottom-4 right-4 z-[5]">
          <Button
            onClick={triggerFullscreen}
            size="sm"
            variant="secondary"
            className="bg-black/50 hover:bg-black/70 font-mono uppercase tracking-wider font-medium"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            FULLSCREEN
          </Button>
        </div>
      )}
    </div>
  );
}
