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
    length:
      embedding.length,

    firstFive:
      embedding.slice(
        0,
        5
      ),
  };

}