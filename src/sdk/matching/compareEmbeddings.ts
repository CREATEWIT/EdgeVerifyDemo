export function compareEmbeddings(
  embedding1: number[],
  embedding2: number[],
) {

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (
    let i = 0;
    i < embedding1.length;
    i++
  ) {

    dot +=
      embedding1[i] *
      embedding2[i];

    normA +=
      embedding1[i] *
      embedding1[i];

    normB +=
      embedding2[i] *
      embedding2[i];

  }

  return (
    dot /
    (
      Math.sqrt(normA) *
      Math.sqrt(normB)
    )
  );

}