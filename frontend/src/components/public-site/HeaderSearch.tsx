"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export function HeaderSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = query.trim();
    const destination = keyword ? `/search?q=${encodeURIComponent(keyword)}` : "/search";

    setIsOpen(false);
    router.push(destination);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 sm:h-12 sm:w-12"
        type="button"
        aria-label={isOpen ? "Close search" : "Open search"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <CloseIcon /> : <SearchIcon />}
      </button>

      <form
        className={`fixed left-4 right-4 top-24 z-[70] transform rounded-[4px] bg-white p-0 shadow-2xl shadow-slate-950/25 transition duration-300 sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.85rem)] sm:w-80 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        role="search"
        aria-label="Public website search"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="header-search-keyword">
          Search keyword
        </label>
        <div className="flex min-h-14 items-center gap-3 px-5">
          <input
            ref={inputRef}
            id="header-search-keyword"
            className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-500"
            type="search"
            value={query}
            placeholder="Search Keyword..."
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#061f3f] transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            type="submit"
            aria-label="Submit search"
          >
            <SearchIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
