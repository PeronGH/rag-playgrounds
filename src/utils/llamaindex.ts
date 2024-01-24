import { Document, SimpleNodeParser } from "llamaindex";
import OpenAI from "openai";


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

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  "use server";

  const openai = new OpenAI();

  const { data } = await openai.embeddings.create({
    input: texts,
    model: "text-embedding-ada-002",
  });

  return data.map(({ embedding }) => embedding);
}
