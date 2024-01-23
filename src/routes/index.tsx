import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { DocumentsList } from "~/components/documents-list";
import { FilesInputButton } from "~/components/files-input-button";
import { FileDocument } from "~/types";
import { CHECKED_CHECKBOX, UNCHECKED_CHECKBOX } from "~/utils/constants";

export default function Home() {
  const [stage, setStage] = createSignal(1);
  const [documents, setDocuments] = createStore<FileDocument[]>([]);

  return (
    <main class="container mt-4">
      <h1>RAG Playgrounds</h1>
      <h2>
        {documents.length ? CHECKED_CHECKBOX : UNCHECKED_CHECKBOX}{" "}
        Step 1. Choose Your Documents
      </h2>
      <div role="group">
        <FilesInputButton
          onChange={async (files) => {
            const fileContents = await Promise.all(
              Array.from(files).map((file) => file.text().catch(() => "Error")),
            );

            setDocuments(
              produce((documents) =>
                documents.push(
                  ...fileContents.map((content) => ({
                    id: crypto.randomUUID(),
                    content,
                  })),
                )
              ),
            );
          }}
        />
        <button
          class="secondary"
          onClick={() =>
            setDocuments(produce((documents) =>
              documents.push({ id: crypto.randomUUID(), content: "" })
            ))}
        >
          Add Empty
        </button>
      </div>
      <DocumentsList
        documents={documents}
        onEdit={(id, content) =>
          setDocuments(
            (document) =>
              document.id === id,
            produce((document) => document.content = content),
          )}
      />
    </main>
  );
}
