import {
  loadTensorflowModel,
} from 'react-native-fast-tflite';

let cachedModel: any = null;

export async function loadFaceModel() {

  if (cachedModel) {
    return cachedModel;
  }

  cachedModel =
    await loadTensorflowModel(
      require(
        '../../../assets/models/mobilefacenet.tflite'
      ),
      []
    );

  return cachedModel;
}