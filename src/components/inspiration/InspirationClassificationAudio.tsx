import { useEffect, useRef, useState } from "react";
import {
  MicrophoneIcon,
  StopIcon,
  TrashIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_SECONDS = 120;

export function InspirationClassificationAudio({
  referenceKey,
  onRecordingChange,
}: {
  referenceKey: string;
  onRecordingChange: (hasAudio: boolean) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    onRecordingChange(Boolean(audioUrl));
  }, [audioUrl, onRecordingChange]);

  function clearAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    onRecordingChange(false);
  }

  async function startRecording() {
    setError(null);
    clearAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(() => {
        setSeconds((value) => {
          if (value + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return value + 1;
        });
      }, 1000);
    } catch {
      setError("No pudimos acceder al micrófono. Revisá permisos del navegador.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
  }

  function downloadAudio() {
    if (!audioUrl) return;
    const anchor = document.createElement("a");
    anchor.href = audioUrl;
    anchor.download = `referencia-${referenceKey.replace(/[:/]/g, "-")}.webm`;
    anchor.click();
  }

  const timeLabel = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/15 p-3">
      <div>
        <p className="text-[13px] font-medium">Contexto en audio</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
          Contame qué ves en la referencia: formato, hook, de qué trata, qué
          copiarías. Después adjuntá el audio en Cursor junto con el pedido
          copiado.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <Button type="button" size="sm" variant="outline" onClick={startRecording}>
            <MicrophoneIcon className="size-3.5" />
            Grabar
          </Button>
        ) : (
          <Button type="button" size="sm" variant="destructive" onClick={stopRecording}>
            <StopIcon className="size-3.5" />
            Detener · {timeLabel}
          </Button>
        )}
        {audioUrl ? (
          <>
            <Button type="button" size="sm" variant="outline" onClick={downloadAudio}>
              <DownloadSimpleIcon className="size-3.5" />
              Descargar audio
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Borrar audio"
              onClick={clearAudio}
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </>
        ) : null}
      </div>

      {audioUrl ? (
        <audio controls src={audioUrl} className="w-full" preload="metadata" />
      ) : null}

      {error ? (
        <p className={cn("text-[12px] text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
}
