import { Accessor, Component, Index } from "solid-js";
import { TextWithSimilarity } from "~/types";

export interface SimilarChunksListProps {
  similarities: Accessor<TextWithSimilarity[]>;
}

export const SimilarChunksList: Component<SimilarChunksListProps> = ({
  similarities,
}) => {
  return (
    <div class="flex gap-x-2 overflow-x-auto p-8">
      <Index each={similarities()}>
        {(embedding) => (
          <article class="min-w-96">
            <header class="font-mono">{embedding().similarity}</header>
            <textarea
              class=" resize-none h-96"
              value={embedding().text}
              readonly
            />
          </article>
        )}
      </Index>
    </div>
  );
};
