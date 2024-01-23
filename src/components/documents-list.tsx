import { Component, For } from "solid-js";
import { FileDocument } from "~/types";

export interface DocumentsListProps {
  documents: FileDocument[];
  onEdit: (id: string, content: string) => void;
}

export const DocumentsList: Component<DocumentsListProps> = ({
  documents,
  onEdit,
}) => {
  return (
    <div class="flex gap-x-2 overflow-x-auto">
      <For each={documents}>
        {(document) => (
          <article class="min-w-96">
            <header>{document.id}</header>
            <textarea
              class="resize-none h-96"
              value={document.content}
              onInput={(e) => onEdit(document.id, e.currentTarget.value)}
            />
          </article>
        )}
      </For>
    </div>
  );
};
