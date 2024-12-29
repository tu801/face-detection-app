import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

export async function loadTrainModels() {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  toast.success('Models loaded');
}

export async function loadTrainingData() {
  const labels = [
    'Fukada Eimi',
    'Jun Aizawa',
    'Ria Sakurai',
    'Rina Ishihara',
    'Takizawa Laura',
    'Yua Mikami',
  ];

  const faceDescriptors = [];
  for (const label of labels) {
    const descriptors = [];
    for (let i = 1; i <= 8; i++) {
      const img = await faceapi.fetchImage(`/data/${label}/${i}.jpeg`);
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detections) {
        descriptors.push(detections.descriptor);
      }
    }
    faceDescriptors.push(
      new faceapi.LabeledFaceDescriptors(label, descriptors)
    );
    toast.success(`Đã training xong dữ liệu của ${label}`);
  }

  return faceDescriptors;
}

export type TrainingData = { _label: string; _descriptors: number[][] };

export function deserializeTrainingData(data: TrainingData[]) {
  return data.map((item) => {
    return new faceapi.LabeledFaceDescriptors(
      item._label,
      item._descriptors.map((d) => new Float32Array(d))
    );
  });
}
