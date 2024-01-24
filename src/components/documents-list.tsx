import { Component, Index } from "solid-js";

export interface DocumentsListProps {
  documents: string[];
  onEdit?: (idx: number, content: string) => void;
}

export const DocumentsList: Component<DocumentsListProps> = ({
  documents,
  onEdit,
}) => {
  return (
    <div class="flex gap-x-2 overflow-x-auto p-8">
      <Index each={documents}>
        {(document, i) => (
          <article class="min-w-96">
            <header>Document {i + 1}</header>
            <textarea
              class="resize-none h-96"
              value={document()}
              readonly={!onEdit}
              oninput={onEdit &&
                ((e) => onEdit(i, e.currentTarget.value))}
            />
          </article>
        )}
      </Index>
    </div>
  );
};
