import {
  loadFaceModel,
} from './loadModel';

export async function
generateEmbedding(
  _pixelBuffer: ArrayBuffer,
) {

 console.log(
  'STEP_1_MODEL_LOADING'
);

const model =
  await loadFaceModel();

console.log(
  'STEP_2_MODEL_LOADED'
);

const input =
  new Float32Array(
    1 * 112 * 112 * 3
  );

console.log(
  'STEP_3_INPUT_CREATED'
);

const output =
  await model.run([
    input.buffer,
  ]);

console.log(
  'STEP_4_MODEL_FINISHED'
);

return output;
}