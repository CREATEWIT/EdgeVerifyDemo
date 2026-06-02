import { Images }
  from 'react-native-nitro-image';
  import {
  loadFaceModel,
} from './loadModel';

export async function
generateEmbedding(
  _pixelBuffer: ArrayBuffer,
) {

  const image =
    await Images.loadFromEncodedImageDataAsync(
      {
        buffer:
          _pixelBuffer,
        width: 112,
        height: 112,
        imageFormat: 'jpg',
      }
    );

  console.log(
    'IMAGE_LOADED',
    image.width,
    image.height
  );

  const resized =
    image.resize(
      112,
      112
    );

  console.log(
    'IMAGE_RESIZED'
  );

  const raw =
    resized.toRawPixelData();
  const pixels =
  new Uint8Array(
    raw.buffer
  );

console.log(
  'PIXEL_COUNT',
  pixels.length
);

console.log(
  'FIRST_16_PIXELS',
  Array.from(
    pixels.slice(0, 16)
  )
);

  console.log(
    'RAW_PIXEL_FORMAT',
    raw.pixelFormat
  );

  console.log(
    'RAW_WIDTH',
    raw.width
  );

  console.log(
    'RAW_HEIGHT',
    raw.height
  );

 const input =
  new Float32Array(
    112 * 112 * 3
  );

let inputIndex = 0;

for (
  let i = 0;
  i < pixels.length;
  i += 4
) {

  const b =
    pixels[i];

  const g =
    pixels[i + 1];

  const r =
    pixels[i + 2];

  input[inputIndex++] =
    (r - 127.5) /
    127.5;

  input[inputIndex++] =
    (g - 127.5) /
    127.5;

  input[inputIndex++] =
    (b - 127.5) /
    127.5;
}
console.log(
  'INPUT_LENGTH',
  input.length
);

console.log(
  'INPUT_FIRST_12',
  Array.from(
    input.slice(0, 12)
  )
);
console.log(
  'STEP_1_MODEL_LOADING'
);

const model =
  await loadFaceModel();

console.log(
  'STEP_2_MODEL_LOADED'
);

const output =
  await model.run([
    input.buffer,
  ]);

console.log(
  'STEP_4_MODEL_FINISHED'
);

const embeddingBuffer =
  output[0];

const embedding =
  Array.from(
    new Float32Array(
      embeddingBuffer
    )
  );

console.log(
  'EMBEDDING_LENGTH',
  embedding.length
);

console.log(
  'FIRST_10_VALUES',
  embedding.slice(0, 10)
);

return embedding;
}