"use client";

import { useEffect, useRef, useState } from "react";
import { navItems, profile } from "@/lib/data";
import {
  ArrowUpRight,
  CloseIcon,
  LinkedInIcon,
  MailIcon,
} from "./icons";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("inicio");
  const menuRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setOpen(false);
    window.requestAnimationFrame(() => toggleRef.current?.focus());
  }

  useEffect(() => {
    if (!open) return;

    const dialog = menuRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menuItems = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href]"),
    );
    const frame = window.requestAnimationFrame(() => menuItems[0]?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (query.matches) setOpen(false);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-void/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <a
            href="#inicio"
            className="group flex items-center gap-3"
            aria-label="Volver al inicio"
            onClick={() => setActive("inicio")}
          >
            <span className="relative grid h-9 w-9 place-items-center border border-line-strong transition-colors duration-300 group-hover:border-acid">
              <span className="font-mono text-[10px] tracking-[0.08em] text-bone">
                {profile.initials}
              </span>
              <span className="absolute -right-[3px] -top-[3px] h-[5px] w-[5px] bg-acid" />
            </span>
            <span className="hidden text-[13px] font-medium tracking-tight text-bone sm:block">
              {profile.shortName} <span className="text-ash">/ Sistemas</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Secciones">
            {navItems.map((item, index) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActive(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`group relative flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isActive ? "text-bone" : "text-ash hover:text-bone"
                  }`}
                >
                  <span
                    className={`font-mono text-[9px] transition-colors duration-300 ${
                      isActive
                        ? "text-acid"
                        : "text-ash/60 group-hover:text-acid"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  {item.label}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-px origin-left bg-acid transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contacto"
              className="btn btn-ghost hidden px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] lg:inline-flex"
            >
              Hablemos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="relative grid h-10 w-10 place-items-center border border-line-strong transition-colors hover:border-acid lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              <span
                className={`absolute h-px w-4 bg-bone transition-all duration-300 ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-bone transition-all duration-300 ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <dialog
          ref={menuRef}
          id="mobile-menu"
          aria-label="Menú de navegación"
          onCancel={(event) => {
            event.preventDefault();
            closeMenu();
          }}
          className="fixed inset-0 z-40 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-void/95 p-0 backdrop-blur-2xl lg:hidden"
        >
          <div className="grid-lines grid-mask absolute inset-0 opacity-40" />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Cerrar menú de navegación"
            className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center border border-line-strong text-ash transition-colors hover:border-acid hover:text-bone"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <div className="shell relative flex h-full flex-col justify-between pb-10 pt-28">
            <nav className="flex flex-col" aria-label="Secciones">
              {navItems.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActive(item.id);
                    closeMenu();
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className="group flex items-baseline justify-between border-b border-line py-5"
                >
                  <span className="text-3xl tracking-tight text-bone transition-colors group-hover:text-acid">
                    {item.label}
                  </span>
                  <span className="label text-ash">0{index + 1}</span>
                </a>
              ))}
            </nav>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-acid" />
                <span className="label text-acid">{profile.availability}</span>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  onClick={closeMenu}
                  className="link-line w-fit text-sm text-bone"
                >
                  <MailIcon className="h-4 w-4 text-acid" />
                  {profile.email}
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="link-line w-fit text-sm text-bone"
                >
                  <LinkedInIcon className="h-4 w-4 text-acid" />
                  LinkedIn
                </a>
              </div>
              <p className="flex flex-col gap-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                <span>{profile.location}</span>
                <span>{profile.coordinates}</span>
              </p>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
