import { useEffect } from "react";

/** Applies the page title and description owned by each route. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }, [title, description]);
}
