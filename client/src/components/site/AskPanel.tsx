import { useEffect, useMemo, useRef } from "react";
import { Link } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import type { AskTurn } from "@/lib/askClient";
import { pieceHref } from "@/lib/askPieces";
import { getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

const { ask: copy } = siteCopy;

/** What a piece needs from the wall's project list. */
export type AskPieceProject = { slug: string; title: string; client?: string; coverImage: string; coverColor?: string };

/**
 * Ask's side of the Explore panel: the greeting and three suggestions, then the conversation. An Atla
 * turn is a short caption, the pieces it picked from the wall and at most two page links. The pieces
 * are the answer; the text is a caption. No bubbles, no avatars, no icons.
 */
export function AskPanel({
  turns,
  pending,
  partial,
  projects,
  onAsk,
  onRestart,
}: {
  turns: AskTurn[];
  pending: boolean;
  partial: string;
  projects: AskPieceProject[];
  onAsk: (text: string) => void;
  onRestart: () => void;
}) {
  const bySlug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [projects]);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest turn in view as it streams.
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [turns.length, pending, partial.length > 0]);

  return (
    <div className="ask">
      {turns.length === 0 ? (
        <div className="ask__intro">
          <p className="ask__greeting">{copy.greeting}</p>
          <ul className="ask__chips" aria-label={copy.chipsLabel}>
            {copy.chips.map((chip) => (
              <li key={chip}>
                <button type="button" className="ask__chip" onClick={() => onAsk(chip)} disabled={pending}>
                  {chip}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol className="ask__log" aria-label={copy.dialog}>
          {turns.map((turn, index) => (
            <li key={index} className="ask__turn" data-role={turn.role}>
              <span className="ask__sr">{turn.role === "visitor" ? copy.visitor : copy.atla}: </span>
              <p className="ask__text">{turn.text}</p>
              {turn.role === "atla" ? <AskPieces slugs={turn.slugs} bySlug={bySlug} /> : null}
              {turn.role === "atla" && turn.links.length ? (
                <p className="ask__links">
                  {turn.links.map((link) => (
                    <Link key={link.href} href={link.href} className="site-link">
                      {link.label}
                    </Link>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
          {pending ? (
            <li className="ask__turn" data-role="atla" aria-busy="true">
              {partial ? (
                <p className="ask__text">{partial}</p>
              ) : (
                <span className="ask__dot" role="status">
                  <span className="ask__sr">{copy.thinking}</span>
                </span>
              )}
            </li>
          ) : null}
        </ol>
      )}
      {/* Settled answers are read once, whole; the stream itself is not announced word by word. */}
      <p className="ask__sr" aria-live="polite">
        {!pending && turns.at(-1)?.role !== "visitor" ? turns.at(-1)?.text ?? "" : ""}
      </p>
      {turns.length > 0 && !pending ? (
        <button type="button" className="ask__restart" onClick={onRestart}>
          {copy.restart}
        </button>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}

function AskPieces({ slugs, bySlug }: { slugs: string[]; bySlug: Map<string, AskPieceProject> }) {
  const pieces = slugs.map((slug) => bySlug.get(slug)).filter((p): p is AskPieceProject => Boolean(p));
  if (!pieces.length) return null;
  return (
    <ul className="ask__pieces" aria-label={copy.piecesLabel}>
      {pieces.map((piece) => {
        const dims = getImageDimensions(piece.coverImage);
        return (
          <li key={piece.slug}>
            <Link href={pieceHref(piece.slug, piece.coverImage)} className="ask__piece">
              <span className="ask__piece-media" style={piece.coverColor ? { background: piece.coverColor } : undefined}>
                <img
                  src={getOptimizedImageUrl(piece.coverImage, { width: 480, quality: 80 }) || piece.coverImage}
                  alt=""
                  width={dims?.width}
                  height={dims?.height}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="ask__piece-title">{piece.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
