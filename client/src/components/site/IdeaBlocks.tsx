import { Link } from "wouter";
import { siteCopy } from "@/content/siteCopy";

export function IdeaBlocks() {
  return (
    <ul className="idea-blocks" aria-label="About the studio">
      {siteCopy.blocks.map((block) => (
        <li key={block.label}>
          <Link href={block.href} className="idea-block">
            <span className="idea-block__label">{block.label}</span>
            <span className="idea-block__title">{block.title}</span>
            <span className="idea-block__body">{block.body}</span>
            <svg className="idea-block__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}
