'use client';
import { loadTrainingData } from '@/utils/training';
import * as faceapi from 'face-api.js';
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Loading from './loading';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(
    null
  );

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    toast.success('Models loaded');

    const trainingData = await loadTrainingData();
    console.log(trainingData);
    const faceMatcher = new faceapi.FaceMatcher(trainingData, 0.6);
    setFaceMatcher(faceMatcher);
    setLoading(false);
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const detectFaces = async () => {
      if (imageSrc && imgRef.current && canvasRef.current) {
        const img = imgRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          // Đảm bảo canvas có cùng kích thước với ảnh
          canvas.width = img.width;
          canvas.height = img.height;

          // Phát hiện gương mặt
          // const detections = await faceapi
          //   .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          //   .withFaceExpressions();
          const detections = await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions();

          // Xóa canvas trước khi vẽ
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Vẽ ảnh lên canvas
          context.drawImage(img, 0, 0, img.width, img.height);

          // Vẽ các khung nhận diện gương mặt lên canvas
          const resizedDetections = faceapi.resizeResults(detections, {
            width: img.width,
            height: img.height,
          });
          // faceapi.draw.drawDetections(canvas, resizedDetections);
          // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          for (const detection of resizedDetections) {
            const box = detection.detection.box;
            if (faceMatcher) {
              const labelText = faceMatcher
                .findBestMatch(detection.descriptor)
                .toString();

              const drawBox = new faceapi.draw.DrawBox(box, {
                label: labelText,
              });
              drawBox.draw(canvas);
              console.log(labelText);
              if (labelText.includes('unknown')) {
                toast.error('Không thể nhận diện ra người này!');
              } else {
                toast.success(`Đây là ${labelText}`);
              }
            }
          }
        }
      }
    };

    detectFaces();
  }, [imageSrc, faceMatcher]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Nhận diện JAV </h1>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Selected"
              style={{ maxWidth: '500px', display: 'block' }}
            />
          )}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </main>
    </div>
  );
}
