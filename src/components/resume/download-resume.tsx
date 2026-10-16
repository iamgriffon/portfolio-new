"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareResume, resumeLocale, type ResumeInput } from "@/lib/resume-data";

export function DownloadResume(input: ResumeInput) {
  const t = useTranslations("main.resume");
  const locale = useLocale();
  const busy = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const empty = !input.jobs.length && !input.education.length;

  async function download() {
    if (busy.current || empty) return;
    busy.current = true;
    setStatus("loading");
    try {
      const data = prepareResume(input, resumeLocale(locale), t("present"));
      const { createResumePdf } = await import("./resume-document");
      const blob = await createResumePdf(data, {
        title: t("title"), experience: t("experience"), education: t("education"), technologies: t("technologies"),
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Gustavo-Dupin-CV-${data.locale}.pdf`;
      document.body.appendChild(link);
      try { link.click(); } finally {
        link.remove();
        // Keep the URL alive until the browser has consumed the download.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  return <div className="mb-4 flex flex-col items-end gap-2">
    <Button type="button" onClick={download} disabled={empty || status === "loading"} aria-busy={status === "loading"}
      className="bg-green-400 text-slate-950 hover:bg-green-300 cursor-pointer">
      {status === "loading" ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Download aria-hidden="true" />}
      {t(status === "loading" ? "downloadLoading" : "download")}
    </Button>
    <p role={status === "error" ? "alert" : "status"} className={`text-sm ${status === "error" ? "text-red-300" : "text-gray-300"}`}>
      {empty ? t("downloadEmpty") : status === "success" ? t("downloadSuccess") : status === "error" ? t("downloadError") : ""}
    </p>
  </div>;
}
