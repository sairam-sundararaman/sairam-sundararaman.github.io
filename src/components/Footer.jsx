import { useState } from "react";
import { GraduationCap, Fingerprint, Copy, Check } from "lucide-react";
import { GithubMark } from "./ui/GithubMark";
import content from "../data/content.json";

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fall back to a mailto link instead.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-2 font-mono text-sm text-mist transition-colors duration-200 hover:text-cyan"
    >
      <span>{email}</span>
      {copied ? <Check size={14} className="text-cyan" /> : <Copy size={14} className="opacity-60 group-hover:opacity-100" />}
      <span className="sr-only">{copied ? "Copied" : "Copy email address"}</span>
    </button>
  );
}

export function Footer() {
  const { contact } = content;

  return (
    <footer id="contact" className="scroll-mt-6 border-t border-line-dark bg-void">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-2">
          <p className="font-display text-white/90">Reach out about research, or anything else.</p>
          <CopyEmail email={contact.email} />
        </div>

        <div className="flex items-center gap-5 text-mist">
          <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-cyan transition-colors">
            <GithubMark size={19} />
          </a>
          <a
            href={contact.googleScholar}
            target="_blank"
            rel="noreferrer"
            aria-label="Google Scholar"
            className="hover:text-cyan transition-colors"
          >
            <GraduationCap size={19} />
          </a>
          <a href={contact.orcid} target="_blank" rel="noreferrer" aria-label="ORCID" className="hover:text-cyan transition-colors">
            <Fingerprint size={19} />
          </a>
        </div>
      </div>
      <div className="border-t border-line-dark px-5 py-4 text-center font-mono text-[11px] text-mist/70 sm:px-8">
        Built with React, Three.js &amp; anime.js — deployed on GitHub Pages.
      </div>
    </footer>
  );
}
