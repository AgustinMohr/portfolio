"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/data";
import { ArrowUpRight } from "./icons";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) return;

    const subject = `Contacto desde el portfolio — ${name}`;
    const body = `Hola Agustín,\n\n${message}\n\n—\n${name}\n${email}`;

    setStatus("Abriendo tu cliente de correo con el mensaje listo.");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="label block text-ash"
          >
            Nombre
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className="field"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="label block text-ash"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vos@empresa.com"
            className="field"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="label block text-ash"
        >
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Contame qué tenés en mente: una oportunidad, un proyecto o simplemente una charla."
          className="field resize-none"
        />
      </div>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[17rem] text-xs leading-relaxed text-ash">
          Se abrirá tu cliente de correo con el mensaje listo para enviar.
        </p>
        <button type="submit" className="btn btn-primary">
          Enviar mensaje
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 font-mono text-[10px] uppercase tracking-[0.16em] text-acid"
      >
        {status}
      </p>
    </form>
  );
}
