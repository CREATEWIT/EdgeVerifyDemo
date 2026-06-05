import { Images } from 'react-native-nitro-image';
import {loadFaceModel,} from './loadModel';

export async function
generateEmbedding(
  _pixelBuffer: ArrayBuffer,
  faceBounds: any,
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
  'FACE_BOUNDS_FOR_CROP',
  faceBounds
);
  console.log(
  'IMAGE_PROTO',
  Object.getOwnPropertyNames(
    Object.getPrototypeOf(image)
  )
);

  console.log(
    'IMAGE_LOADED',
    image.width,
    image.height
  );
 const marginX =
  Math.round(
    faceBounds.width * 0.25
  );

const marginY =
  Math.round(
    faceBounds.height * 0.25
  );

const cropX =
  Math.max(
    0,
    Math.round(
      faceBounds.x - marginX
    )
  );

const cropY =
  Math.max(
    0,
    Math.round(
      faceBounds.y - marginY
    )
  );

const cropWidth =
  Math.min(
    image.width - cropX,
    Math.round(
      faceBounds.width +
      marginX * 2
    )
  );

const cropHeight =
  Math.min(
    image.height - cropY,
    Math.round(
      faceBounds.height +
      marginY * 2
    )
  );

console.log(
  'MARGIN_CROP',
  {
    marginX,
    marginY,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  }
);
console.log(
  'IMAGE_SIZE',
  {
    width: image.width,
    height: image.height,
  }
);

console.log(
  'FACE_BOUNDS',
  faceBounds
);

console.log(
  'CROP_ARGS',
  {
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  }
);

let cropped;

try {

console.log(
  'FINAL_CROP_ARGS',
  {
    startX: cropX,
    startY: cropY,
    endX: cropX + cropWidth,
    endY: cropY + cropHeight,
  }
);

cropped =
  await image.cropAsync(
    cropX,
    cropY,
    cropX + cropWidth,
    cropY + cropHeight
  );
  console.log(
  'CROP_SUCCESS'
);

  console.log(
    'IMAGE_CROPPED',
    cropped.width,
    cropped.height
  );

} catch (error) {

  console.log(
    'CROP_FAILED',
    error
  );

  throw error;

}

const resized =
  cropped.resize(
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