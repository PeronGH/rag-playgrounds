import { TextWithEmbeddings } from "~/types";
import { getEmbeddings } from "./llamaindex";
import { dot, norm } from "mathjs";

export async function getTextWithEmbeddings(
  texts: string[],
): Promise<TextWithEmbeddings[]> {
  const embeddings = await getEmbeddings(texts);
  return texts.map((text, i) => ({ text, embeddings: embeddings[i] }));
}

export function calculateCosineSimilarity(
  vector1: number[],
  vector2: number[],
): number {
  const dotProduct = dot(vector1, vector2);

  const magnitude1 = norm(vector1) as number;
  const magnitude2 = norm(vector2) as number;

  return dotProduct / (magnitude1 * magnitude2);
}
