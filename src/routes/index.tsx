import { Accessor, createSignal, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ChunksList } from "~/components/chunks-list";
import { DocumentChunkingSettings } from "~/components/document-chunking-settings";
import { DocumentsList } from "~/components/documents-list";
import { EmbeddingsList } from "~/components/embeddings-list";
import { FilesInputButton } from "~/components/files-input-button";
import { QueryInput } from "~/components/query-input";
import { SimilarChunksList } from "~/components/similar-chunks-list";
import { TextWithEmbeddings, TextWithSimilarity } from "~/types";
import { CHECKED_CHECKBOX, UNCHECKED_CHECKBOX } from "~/utils/constants";
import {
  calculateCosineSimilarity,
  getTextWithEmbeddings,
} from "~/utils/embeddings";
import { chunkDocuments, getEmbeddings } from "~/utils/llamaindex";

export default function Home() {
  const [loading, setLoading] = createSignal(false);
  const [documents, setDocuments] = createStore<string[]>([]);
  const [chunks, setChunks] = createSignal<string[][]>([]);
  const [embeddings, setEmbeddings] = createSignal<TextWithEmbeddings[]>([]);
  const [similarChunks, setSimilarChunks] = createSignal<
    TextWithSimilarity[]
  >([]);

  const stage: Accessor<number> = () => {
    let stage = 0;
    if (documents.length > 0) {
      stage = 1;
      if (chunks().length > 0) {
        stage = 2;
        if (embeddings().length > 0) {
          stage = 3;
          if (similarChunks().length > 0) {
            stage = 4;
          }
        }
      }
    }
    return stage;
  };

  return (
    <main class="container p-4">
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
      <Show when={stage() >= 1}>
        <DocumentsList
          documents={documents}
          onEdit={(idx, content) =>
            setDocuments(produce((documents) => documents[idx] = content))}
        />
        <h2>
          {stage() >= 2 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
          Step 2. Chunk Documents
        </h2>
        <DocumentChunkingSettings
          loading={loading}
          onSubmit={async ({ chunkSize, chunkOverlap }) => {
            setLoading(true);
            setChunks(
              await chunkDocuments({ chunkSize, chunkOverlap, documents }),
            );
            setLoading(false);
          }}
        />
        <Show when={stage() >= 2}>
          <ChunksList chunks={chunks} />
          <h2>
            {stage() >= 3 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
            Step 3. Get Embeddings
          </h2>
          <button
            class="w-full"
            aria-busy={loading()}
            disabled={loading()}
            onclick={async () => {
              setLoading(true);
              setEmbeddings(
                await getTextWithEmbeddings(chunks().flatMap((chunk) => chunk)),
              );
              setLoading(false);
            }}
          >
            Get Embeddings
          </button>
          <Show when={stage() >= 3}>
            <EmbeddingsList embeddings={embeddings} />
            <h2>
              {stage() >= 4 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
              Step 4. Query Similar Embeddings
            </h2>
            <QueryInput
              loading={loading}
              onSubmit={async (query) => {
                setLoading(true);

                const [queryEmbeddings] = await getEmbeddings([query]);

                setSimilarChunks(
                  embeddings().map(({ text, embeddings }) => ({
                    text,
                    similarity: calculateCosineSimilarity(
                      queryEmbeddings,
                      embeddings,
                    ),
                  })).toSorted((a, b) => b.similarity - a.similarity),
                );

                setLoading(false);
              }}
            />
            <Show when={stage() >= 4}>
              <SimilarChunksList similarities={similarChunks} />
              <h2>
                {stage() >= 5 ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
                Step 5. Text Generation
              </h2>
            </Show>
          </Show>
        </Show>
      </Show>
    </main>
  );
}
