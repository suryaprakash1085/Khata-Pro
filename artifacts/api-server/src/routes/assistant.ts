import { Router, type IRouter } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getAiExplanation, AiAssistantUnavailableError } from '../services/aiAssistant.service';

const router: IRouter = Router();

router.post('/ask', requireAuth, async (req, res): Promise<void> => {
  try {
    // Following the same convention as products.ts (business_id passed
    // explicitly, not derived from the JWT) — send business_id in the
    // request body from the frontend, same value useBusiness() already has.
    const businessId = parseInt(req.body?.business_id, 10);
    const question = (req.body?.question as string | undefined)?.trim();

    if (isNaN(businessId)) {
      res.status(400).json({ error: 'business_id is required' });
      return;
    }
    if (!question) {
      res.status(400).json({ error: 'question is required' });
      return;
    }

    const text = await getAiExplanation(businessId, question);
    res.json({ text });
  } catch (err) {
    if (err instanceof AiAssistantUnavailableError) {
      res.status(503).json({ text: 'AI Assistant is temporarily unavailable. You can still use the normal POS features.' });
      return;
    }
    console.error('assistant/ask error:', err);
    res.status(500).json({ text: "Sorry, I couldn't retrieve that information right now. Please try again." });
  }
});

export default router;