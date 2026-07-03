import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseIntent } from '../services/gemini.service';
import { createError } from '../middleware/errorHandler';

const router = Router();

const parseIntentSchema = z.object({
  input: z.string().min(1).max(500),
  userId: z.string().optional(),
});

// POST /api/intent/parse
router.post('/parse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = parseIntentSchema.safeParse(req.body);

    if (!validation.success) {
      return next(createError('Invalid request body', 400));
    }

    const { input } = validation.data;
    const parsed = await parseIntent(input);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
