import { Accessor, Component, Index } from "solid-js";
import { TextWithEmbeddings } from "~/types";

export interface EmbeddingsListProps {
  embeddings: Accessor<TextWithEmbeddings[]>;
}

export const EmbeddingsList: Component<EmbeddingsListProps> = ({
  embeddings,
}) => {
  return (
    <div class="flex gap-x-2 overflow-x-auto p-8">
      <Index each={embeddings()}>
        {(embedding) => (
          <article class="min-w-96">
            <header class="truncate">{embedding().text}</header>
            <textarea
              class="font-mono resize-none h-96"
              value={JSON.stringify(embedding().embeddings)}
              readonly
            />
          </article>
        )}
      </Index>
    </div>
  );
};
