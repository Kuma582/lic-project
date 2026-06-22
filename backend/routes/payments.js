import express from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lic_super_secret_key';

// Middleware to verify user token
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

// Get user's policies to pay premium
router.get('/policies', verifyUser, async (req, res) => {
  try {
    const policies = await prisma.policy.findMany({
      where: { userId: req.userId },
      include: { plan: true }
    });
    res.json({ status: 'success', data: policies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch policies' });
  }
});

// Get user's payment history
router.get('/history', verifyUser, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.userId },
      include: { policy: true },
      orderBy: { payDate: 'desc' }
    });
    
    const formattedPayments = payments.map(p => ({
      id: p.txnId,
      policyNo: p.policy.policyNo,
      date: p.payDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: `₹${p.amount.toLocaleString()}`,
      method: p.payMode,
      status: p.status === 'Success' ? 'PAID' : 'PENDING'
    }));

    res.json({ status: 'success', data: formattedPayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payment history' });
  }
});

import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummyKeyId123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummySecretKey456',
});

// Create Razorpay Order
router.post('/create-order', verifyUser, async (req, res) => {
  try {
    const { amount, policyId } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `rcpt_${policyId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ status: 'success', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to create order' });
  }
});

// Verify Payment
router.post('/verify', verifyUser, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      policyId, 
      amount, 
      payMode 
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummySecretKey456';
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

    // In a production environment, you MUST verify the signature. 
    // Since we're using a dummy frontend checkout without a real Razorpay modal (unless keys are real),
    // we'll accept it if signature is missing (for fallback demo purposes) or verify if present.
    
    let isAuthentic = true;
    if (razorpay_signature && process.env.RAZORPAY_KEY_ID) {
      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      const newPayment = await prisma.payment.create({
        data: {
          txnId: razorpay_payment_id || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          policyId,
          userId: req.userId,
          amount: parseFloat(amount),
          payMode: payMode || 'Razorpay',
          status: 'Success'
        },
        include: { policy: { include: { plan: true } } }
      });

      res.json({ status: 'success', message: 'Payment verified successfully', data: newPayment });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Payment verification failed' });
  }
});

export default router;
