"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/data";
import { ArrowUpRight, DownloadIcon } from "./icons";

export function CvDownload() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      document.body.style.overflow = "";
    };
  }, []);

  function openDialog() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    document.body.style.overflow = "hidden";
    dialog.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className="group flex flex-col justify-between gap-10 bg-void p-6 text-left transition-colors duration-300 hover:bg-panel/60"
      >
        <div className="flex w-full items-center justify-between">
          <DownloadIcon className="h-4 w-4 text-acid" />
          <ArrowUpRight className="h-4 w-4 text-ash transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid" />
        </div>
        <div>
          <p className="label text-ash">CV</p>
          <p className="mt-2 text-lg tracking-tight text-bone">Descargar CV</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ash">
            Documento en PDF.
          </p>
        </div>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="cv-dialog-title"
        aria-describedby="cv-dialog-description"
        className="m-auto w-[calc(100%-2rem)] max-w-md border border-line-strong bg-panel p-6 text-bone shadow-2xl backdrop:bg-void/80 backdrop:backdrop-blur-sm"
      >
        <p className="label text-acid">CV</p>
        <h3 id="cv-dialog-title" className="mt-3 text-2xl tracking-tight">
          Descargar mi CV
        </h3>
        <p
          id="cv-dialog-description"
          className="mt-3 text-sm leading-relaxed text-ash"
        >
          Se va a descargar el archivo{" "}
          <span className="text-bone">{profile.cvFileName}</span> en tu
          dispositivo. ¿Querés continuar?
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={closeDialog} className="btn btn-ghost">
            Cancelar
          </button>
          <a
            href={profile.cvPath}
            download={profile.cvFileName}
            onClick={closeDialog}
            className="btn btn-primary"
          >
            Aceptar
            <DownloadIcon className="h-4 w-4" />
          </a>
        </div>
      </dialog>
    </>
  );
}
