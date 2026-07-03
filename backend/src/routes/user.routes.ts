import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/users/upsert — create or update user after Magic login
router.post('/upsert', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      magicDid: z.string(),
      walletAddress: z.string(),
      displayName: z.string().optional(),
      avatarUrl: z.string().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return next(createError('Invalid user data', 400));
    }

    const { email, magicDid, walletAddress, displayName, avatarUrl } = validation.data;

    const user = await User.findOneAndUpdate(
      { email },
      {
        email,
        magicDid,
        walletAddress: walletAddress.toLowerCase(),
        displayName,
        avatarUrl,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

// GET /api/users/:walletAddress
router.get('/:walletAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({
      walletAddress: req.params.walletAddress.toLowerCase(),
    }).lean();

    if (!user) {
      return next(createError('User not found', 404));
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

export default router;
