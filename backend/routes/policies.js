import express from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lic_super_secret_key';

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

// Get user's policies and pending applications for their dashboard
router.get('/my-policies', verifyUser, async (req, res) => {
  try {
    // 1. Fetch real active policies
    const activePolicies = await prisma.policy.findMany({
      where: { userId: req.userId },
      include: { plan: true, payments: { where: { status: 'Success' } } }
    });

    // 2. Fetch applications (to show pending ones)
    const applications = await prisma.application.findMany({
      where: { userId: req.userId },
      include: { plan: true }
    });

    // Format policies
    const formattedPolicies = activePolicies.map(p => {
      const totalPaid = p.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return {
        id: p.policyNo,
        name: p.plan.name,
        status: p.status.toUpperCase(),
        premium: `₹${p.premium.toLocaleString()}/mo`,
        totalPaid: `₹${totalPaid.toLocaleString()}`,
        nextDue: p.nextDueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        sumAssured: `₹${p.totalAmount.toLocaleString()}`
      };
    });

    // Add pending applications as well
    const formattedApps = applications
      .filter(app => app.status === 'PENDING' || app.status === 'REJECTED')
      .map(app => ({
        id: app.appReference,
        name: app.plan.name,
        status: app.status,
        premium: app.plan.premium,
        totalPaid: '-',
        nextDue: '-',
        sumAssured: 'Pending Approval'
      }));

    res.json({ 
      status: 'success', 
      data: [...formattedPolicies, ...formattedApps] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch your policies' });
  }
});

export default router;
