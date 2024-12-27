import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

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
