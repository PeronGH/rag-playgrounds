import { Accessor, Component, Index } from "solid-js";

export interface ChunksListProps {
  chunks: Accessor<string[][]>;
}

export const ChunksList: Component<ChunksListProps> = ({
  chunks,
}) => {
  return (
    <div class="flex gap-x-2 overflow-x-auto p-8">
      <Index each={chunks()}>
        {(chunkList, i) => (
          <article class="min-w-96 max-h-96 overflow-y-auto">
            <header>Document {i + 1}</header>
            <Index each={chunkList()}>
              {(chunk) => (
                <textarea
                  class="resize-none h-32"
                  value={chunk()}
                  readonly
                />
              )}
            </Index>
          </article>
        )}
      </Index>
    </div>
  );
};
