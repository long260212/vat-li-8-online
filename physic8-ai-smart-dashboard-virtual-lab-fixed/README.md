# Physic8 AI Smart Dashboard

Ứng dụng học tập và luyện tập Vật lí 8 bằng React + Vite + TypeScript, có kho bài tập, tạo mã bài, làm bài trực tuyến và trợ lý AI Gemini.

## Chạy local

```bash
npm install
npm run dev
```

Tạo file `.env.local` từ `.env.example` và thêm:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Không đưa `GEMINI_API_KEY` lên GitHub.

## Deploy Vercel

Nếu `package.json` nằm ngay ở thư mục gốc repo thì Root Directory để `./`.

Environment Variables cần có:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Có thể thêm tùy chọn:

```env
GEMINI_MODEL=gemini-2.5-flash
```

Dự án đã có serverless API cho Vercel:

- `api/generate-questions.js`
- `api/chat-ai.js`
- `api/ai-status.js`

## Ghi chú sửa lỗi

- Không dùng `package-lock.json` rỗng từ AI Studio để tránh lỗi npm install.
- AI có chế độ fallback khi thiếu key hoặc model/API tạm lỗi.
- Mật khẩu bài làm mới được lưu dạng hash ở frontend mức demo; bài cũ lưu plain text vẫn được hỗ trợ để tương thích.
- Link `?code=XXXXXX` tự đưa học sinh vào màn hình nhập mã và nhận diện bài.

## Bản cập nhật: Thí nghiệm ảo + sửa lỗi API 500

### Đã thêm
- Tab **Thí nghiệm ảo** trên thanh điều hướng desktop/mobile.
- 4 mô phỏng tương tác cho Vật lí 8:
  - Áp suất chất rắn: `p = F / S`.
  - Áp suất chất lỏng: `p = d × h`.
  - Lực đẩy Ác-si-mét: `F_A = d × V_chìm`.
  - Cân bằng nhiệt: `Q_tỏa = Q_thu`.

### Đã sửa lỗi Vercel 500
- Chuyển các API serverless từ `.ts` sang `.js` để tránh lỗi runtime ESM trên Vercel.
- Đổi import sang đường dẫn có đuôi file rõ ràng: `../serverless/aiShared.js`.
- API `/api/chat-ai`, `/api/ai-status`, `/api/generate-questions` đã có fallback để hạn chế trả 500 khi AI chưa cấu hình hoặc phản hồi lỗi.

### Cấu hình cần có trên Vercel
Trong **Project Settings > Environment Variables**, thêm một trong hai biến:

```bash
GEMINI_API_KEY=your_real_gemini_key
```

hoặc:

```bash
GOOGLE_API_KEY=your_real_gemini_key
```

Sau khi thêm/sửa biến môi trường, cần **Redeploy** dự án.
