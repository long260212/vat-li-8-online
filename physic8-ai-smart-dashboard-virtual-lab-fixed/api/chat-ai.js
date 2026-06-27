import { chatWithAI, readJsonBody } from '../serverless/aiShared.js';

export default async function handler(req, res) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const result = await chatWithAI(body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('chat-ai function failed:', error?.message || error);
    return res.status(200).json({
      success: true,
      source: 'server-fallback',
      reply: 'Máy chủ AI đang gặp sự cố tạm thời. Em vẫn có thể gửi lại câu hỏi hoặc chuyển sang phần bài học/luyện tập trong ứng dụng.'
    });
  }
}
