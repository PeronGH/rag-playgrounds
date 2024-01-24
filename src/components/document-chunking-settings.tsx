import { Accessor, Component, createSignal } from "solid-js";

export interface DocumentChunkingSettingsProps {
  chunkSizeRange?: [number, number];
  chunkOverlapRange?: [number, number];
  onSubmit(o: { chunkSize: number; chunkOverlap: number }): void;
  loading?: Accessor<boolean>;
}

export const DocumentChunkingSettings: Component<
  DocumentChunkingSettingsProps
> = (
  props,
) => {
  const chunkSizeRange = props.chunkSizeRange ?? [64, 2048];
  const chunkOverlapRange = props.chunkOverlapRange ?? [0, chunkSizeRange[1]];

  const [chunkSize, setChunkSize] = createSignal(chunkSizeRange[0]);
  const [chunkOverlap, setChunkOverlap] = createSignal(chunkOverlapRange[0]);

  return (
    <form
      onsubmit={(e) => {
        e.preventDefault();
        props.onSubmit({
          chunkSize: chunkSize(),
          chunkOverlap: chunkOverlap(),
        });
      }}
    >
      <div class="flex justify-between gap-4">
        <label class="w-full space-y-2">
          <span>Chunk Size</span>
          <input
            type="range"
            name="chunkSize"
            min={chunkSizeRange[0]}
            max={chunkSizeRange[1]}
            value={chunkSize()}
            data-tooltip={chunkSize()}
            onchange={(e) => setChunkSize(e.currentTarget.valueAsNumber)}
            required
          />
        </label>
        <label class="w-full space-y-2">
          <span>Chunk Overlap</span>
          <input
            type="range"
            name="chunkOverlap"
            min={chunkOverlapRange[0]}
            max={chunkOverlapRange[1]}
            value={chunkOverlap()}
            data-tooltip={chunkOverlap()}
            onchange={(e) => setChunkOverlap(e.currentTarget.valueAsNumber)}
            required
          />
        </label>
      </div>
      <button
        type="submit"
        aria-busy={props.loading?.()}
        disabled={props.loading?.()}
      >
        Chunk Documents
      </button>
    </form>
  );
};
