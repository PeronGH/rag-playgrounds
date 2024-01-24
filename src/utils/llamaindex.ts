import { Document, SimpleNodeParser } from "llamaindex";

export interface ChunkDocumentsParams {
  documents: string[];
  chunkSize?: number;
  chunkOverlap?: number;
}

export async function chunkDocuments(
  { documents: textList, chunkSize, chunkOverlap }: ChunkDocumentsParams,
): Promise<string[][]> {
  "use server";
  const documents = textList.map((text) => new Document({ text }));
  const nodes = SimpleNodeParser
    .fromDefaults({ chunkSize, chunkOverlap })
    .getNodesFromDocuments(documents);

  return documents.map((document) => (nodes
    .filter((node) => node.sourceNode?.nodeId === document.id_)
    .map((node) => node.text))
  );
}
