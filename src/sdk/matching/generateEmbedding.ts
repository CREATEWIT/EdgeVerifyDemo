import {
  loadFaceModel,
} from './loadModel';

export async function
generateEmbedding() {

  const model =
    await loadFaceModel();

  const input =
    new Float32Array(
      1 * 112 * 112 * 3
    ).buffer;

  const output =
    await model.run([
      input,
    ]);

  const firstOutput =
    output[0] as any;

  return {
    constructor:
      firstOutput?.constructor?.name,

    byteLength:
      firstOutput?.byteLength,

    length:
      firstOutput?.length,

    keys:
      Object.keys(
        firstOutput || {}
      ),
  };
}