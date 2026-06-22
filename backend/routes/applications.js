import express from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lic_super_secret_key';

// Submit an application (User)
router.post('/', async (req, res) => {
  try {
    const { planId, formData } = req.body;
    let userId = req.body.userId;
    
    // Extract userId from token
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        console.error("Token error:", e);
      }
    }

    if (!userId) {
       return res.status(401).json({ status: 'error', message: 'Unauthorized: Please log in again to submit.' });
    }
    
    // Generate a reference number like LIC-8492-AX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
    const appReference = `LIC-${randomNum}-${randomChars}`;

    const newApp = await prisma.application.create({
      data: {
        appReference,
        userId,
        planId,
        formData: JSON.stringify(formData),
        status: 'PENDING'
      }
    });

    // REALTIME: Notify all connected admins
    if (req.io) {
      // Need to include user and plan names to show nicely in the table/toast
      const fullApp = await prisma.application.findUnique({
        where: { appReference: newApp.appReference },
        include: { user: true, plan: true }
      });
      req.io.emit('admin_notify', { 
        type: 'NEW_APPLICATION',
        message: `New policy application from ${fullApp.user.name}`,
        data: fullApp 
      });
    }

    res.json({ status: 'success', message: 'Application submitted successfully', data: newApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to submit application' });
  }
});

// Get all applications (Admin)
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: { select: { name: true, email: true } },
        plan: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Format response to match frontend expectations
    const formattedApps = applications.map(app => ({
      id: app.appReference,
      user: app.user.name,
      plan: app.plan.name,
      date: app.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: app.status
    }));

    res.json({ status: 'success', data: formattedApps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch applications' });
  }
});

// Update application status (Admin)
router.put('/:appReference', async (req, res) => {
  try {
    const { appReference } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const application = await prisma.application.findUnique({
      where: { appReference },
      include: { plan: true }
    });

    if (!application) {
      return res.status(404).json({ status: 'error', message: 'Application not found' });
    }

    const updatedApp = await prisma.application.update({
      where: { appReference },
      data: { status }
    });

    if (status === 'APPROVED') {
      // Check if policy already exists
      const existingPolicy = await prisma.policy.findFirst({
        where: { userId: application.userId, planId: application.planId }
      });

      if (!existingPolicy) {
        // Parse premium value from string like '₹2,500/month'
        const premiumValue = parseFloat(application.plan.premium.replace(/[^0-9.]/g, '')) || 2500;

        await prisma.policy.create({
          data: {
            policyNo: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
            userId: application.userId,
            planId: application.planId,
            status: 'Active',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 20)),
            premium: premiumValue,
            totalAmount: premiumValue * 12 * 20,
            nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          }
        });
      }
    }

    // REALTIME: Notify the specific user about their application status
    if (req.io) {
      req.io.to(application.userId).emit('user_notify', {
        type: 'APPLICATION_STATUS',
        message: `Your application ${application.appReference} was ${status}`,
        status: status,
        appReference: application.appReference
      });
    }

    res.json({ status: 'success', message: `Application ${status.toLowerCase()} successfully`, data: updatedApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to update application status' });
  }
});

// Track application status by appReference (Public/User)
router.get('/track/:appReference', async (req, res) => {
  try {
    const { appReference } = req.params;
    const application = await prisma.application.findUnique({
      where: { appReference }
    });

    if (!application) {
      return res.status(404).json({ status: 'error', message: 'Application not found with this Reference ID' });
    }

    res.json({ 
      status: 'success', 
      data: {
        appReference: application.appReference,
        status: application.status,
        date: application.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to track application' });
  }
});

export default router;
