import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/transactions — save a new transaction record
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const schema = z.object({
      userId: z.string(),
      walletAddress: z.string(),
      parsedIntent: z.object({
        intent: z.string(),
        recipient: z.string().optional().nullable(),
        recipientAddress: z.string().optional().nullable(),
        amount: z.number().optional().nullable(),
        currency: z.string().optional().nullable(),
        sourceChain: z.string().optional().nullable(),
        destinationChain: z.string().optional().nullable(),
        memo: z.string().optional().nullable(),
        splitParticipants: z.array(z.string()).optional().nullable(),
        rawInput: z.string(),
      }),
      txHash: z.string().optional(),
      status: z.enum(['pending', 'confirming', 'success', 'failed']).default('pending'),
      chain: z.string().default('arbitrum'),
      amountUSD: z.number().optional(),
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return next(createError('Invalid transaction data', 400));
    }

    const tx = new Transaction(validation.data);
    await tx.save();

    return res.status(201).json({ success: true, data: tx });
  } catch (error) {
    console.error('Transaction save error:', error);
    return next(error);
  }
});

// PATCH /api/transactions/:id — update status + txHash after execution
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, txHash, errorMessage } = req.body;

    const tx = await Transaction.findByIdAndUpdate(
      id,
      { status, txHash, errorMessage },
      { new: true }
    );

    if (!tx) {
      return next(createError('Transaction not found', 404));
    }

    return res.json({ success: true, data: tx });
  } catch (error) {
    return next(error);
  }
});

// GET /api/transactions/user/:walletAddress — fetch history
router.get('/user/:walletAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ walletAddress: walletAddress.toLowerCase() })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({ walletAddress: walletAddress.toLowerCase() }),
    ]);

    return res.json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
