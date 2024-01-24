import { Accessor, createSignal, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ChunksList } from "~/components/chunks-list";
import { DocumentChunkingSettings } from "~/components/document-chunking-settings";
import { DocumentsList } from "~/components/documents-list";
import { EmbeddingsList } from "~/components/embeddings-list";
import { FilesInputButton } from "~/components/files-input-button";
import { TextWithEmbeddings } from "~/types";
import { CHECKED_CHECKBOX, UNCHECKED_CHECKBOX } from "~/utils/constants";
import { chunkDocuments, getTextWithEmbeddings } from "~/utils/llamaindex";

export default function Home() {
  const [documents, setDocuments] = createStore<string[]>([]);
  const [chunks, setChunks] = createSignal<string[][]>([]);
  const [embeddings, setEmbeddings] = createSignal<TextWithEmbeddings[]>([]);

  const stage: Accessor<number> = () => {
    let stage = 0;
    if (documents.length > 0) {
      stage = 1;
      if (chunks().length > 0) {
        stage = 2;
        if (embeddings().length > 0) {
          stage = 3;
        }
      }
    }
    return stage;
  };

  return (
    <main class="container mt-4">
      <h1>RAG Playgrounds</h1>
      <h2>
        {stage() >= 1 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
        Step 1. Choose Your Documents
      </h2>
      <div role="group">
        <FilesInputButton
          onChange={async (files) => {
            const fileContents = await Promise.all(
              Array.from(files).map((file) => file.text().catch(() => "Error")),
            );

            setDocuments(
              produce((documents) => documents.push(...fileContents)),
            );
          }}
        />
        <button
          class="secondary"
          onclick={() =>
            setDocuments(produce((documents) => documents.push("")))}
        >
          Add Empty
        </button>
      </div>
      <DocumentsList
        documents={documents}
        onEdit={(idx, content) =>
          setDocuments(produce((documents) => documents[idx] = content))}
      />
      <Show when={stage() >= 1}>
        <h2>
          {stage() >= 2 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
          Step 2. Chunk Documents
        </h2>
        <DocumentChunkingSettings
          onSubmit={async ({ chunkSize, chunkOverlap }) =>
            setChunks(
              await chunkDocuments({ chunkSize, chunkOverlap, documents }),
            )}
        />
        <ChunksList chunks={chunks} />
        <Show when={stage() >= 2}>
          <h2>
            {stage() >= 3 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
            Step 3. Get Embeddings
          </h2>
          <button
            class="w-full"
            onclick={async () =>
              setEmbeddings(
                await getTextWithEmbeddings(chunks().flatMap((chunk) => chunk)),
              )}
          >
            Get Embeddings
          </button>
          <EmbeddingsList embeddings={embeddings} />
        </Show>
      </Show>
    </main>
  );
}
