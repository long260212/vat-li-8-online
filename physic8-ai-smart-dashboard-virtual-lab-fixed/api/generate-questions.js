import { generateQuestions, readJsonBody } from '../serverless/aiShared.js';

export default async function handler(req, res) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const payload = await generateQuestions(body);
    return res.status(200).json(payload);
  } catch (error) {
    console.error('generate-questions function failed:', error?.message || error);
    return res.status(200).json({
      success: true,
      source: 'server-fallback',
      message: 'Máy chủ tạo câu hỏi đang gặp sự cố tạm thời. Hệ thống trả về câu hỏi mẫu dự phòng.',
      questions: []
    });
  }
}
