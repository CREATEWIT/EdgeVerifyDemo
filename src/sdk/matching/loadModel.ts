import {
  loadTensorflowModel,
} from 'react-native-fast-tflite';

export async function loadFaceModel() {

  const model =
    await loadTensorflowModel(
      require(
        '../../../assets/models/mobilefacenet.tflite'
      ),
      []
    );

  return model;
}