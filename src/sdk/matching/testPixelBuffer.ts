import {
  generateEmbedding,
} from './generateEmbedding';

export async function
testPixelBuffer(
  photo: any,
) {

  console.log(
    'PIXEL_1'
  );

  const pixelBuffer =
    photo.getPixelBuffer();

  console.log(
    'PIXEL_2',
    pixelBuffer.byteLength
  );

  const embedding =
    await generateEmbedding(
      pixelBuffer
    );

  console.log(
    'PIXEL_3'
  );

  return {
    embeddingType:
      typeof embedding,

    isArray:
      Array.isArray(
        embedding
      ),

    length:
      embedding.length,
  };

}