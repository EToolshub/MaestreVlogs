"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LangSwitch } from "./LangSwitch";
import { cn } from "@/lib/utils";

export function Header({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#sobre-mi", label: nav.about },
    { href: "#numeros", label: nav.stats },
    { href: "#audiencia", label: nav.audience },
    { href: "#contenido", label: nav.content },
    { href: "#formatos", label: nav.formats },
    { href: "#contacto", label: nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-white/[0.06] bg-header backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href={`/${lang}`} aria-label="MaestreVlogs" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-body transition-colors hover:bg-white/5 hover:text-heading"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} label={nav.language} />
          <Button href="#contacto" size="sm" className="hidden sm:inline-flex" icon={<ArrowUpRight className="h-4 w-4" />} iconPosition="right">
            {nav.cta}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? nav.close : nav.menu}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-600 text-heading lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Móvil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-white/[0.06] bg-ink-950 px-4 pb-10 pt-4 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <li key={link.href} className="border-b border-white/[0.06]">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-4xl text-heading"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <Button href="#contacto" onClick={() => setOpen(false)} fullWidth size="lg" className="mt-8">
              {nav.cta}
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
