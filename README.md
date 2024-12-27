# App Nhận Diện Gương Mặt

Phần mềm nhận diện gương mặt theo dữ liệu được training từ trước

## Cấu trúc thư mục

```plaintext
face-detection-app/
├── electron/
├── public/
│   └── data
│   └── models
├── src/
│   ├── app/
│   ├── utils/
│   └── ...
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

- electron: Chứa các cấu hình dựng app bằng electron
- public/data: chứa các file dữ liệu để training nhận diện gương mặt
- public/model: các model dựng sẵn bằng tensorflow core. Tham khảo thêm tại github: https://github.com/justadudewhohacks/face-api.js
- src/app: các file chạy chính của app code bằng Nextjs 15

## Getting Started

Run the development server:

```bash
npm run dev
```

Build APp:

```bash
npm run build
```
