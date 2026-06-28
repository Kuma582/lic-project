import express from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'lic_super_secret_key';

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    
    req.adminId = decoded.userId;
    req.adminRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

// Middleware to check if user is SUPER_ADMIN
const requireSuperAdmin = async (req, res, next) => {
  if (req.adminRole !== 'SUPER_ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Access denied. Owner only.' });
  }
  next();
};

// Apply middleware to all routes in this file
router.use(requireAdmin);

// Get Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const totalApplications = await prisma.application.count();
    const pendingApplications = await prisma.application.count({ where: { status: 'PENDING' } });
    const totalPolicies = await prisma.policy.count();
    const activePolicies = await prisma.policy.count({ where: { status: 'Active' } });
    
    // Calculate total collection (simplified)
    const collections = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'Success' }
    });
    const totalRevenue = collections._sum.amount || 0;

    res.json({
      status: 'success',
      data: {
        users: { total: totalUsers },
        applications: { total: totalApplications, pending: pendingApplications },
        policies: { total: totalPolicies, active: activePolicies },
        revenue: { total: totalRevenue }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch admin stats' });
  }
});

// Get all customers (users)
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        _count: {
          select: { policies: true, applications: true }
        },
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        payments: {
          where: { status: 'Success' },
          select: { amount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = customers.map(c => {
      let address = 'N/A';
      let phone = 'N/A';
      
      if (c.applications && c.applications.length > 0) {
        try {
          const formData = typeof c.applications[0].formData === 'string' 
            ? JSON.parse(c.applications[0].formData) 
            : c.applications[0].formData;
          address = formData.address || 'N/A';
          phone = formData.phone || 'N/A';
        } catch(e) {
          console.error('Error parsing formData for address/phone', e);
        }
      }

      const totalSpent = c.payments ? c.payments.reduce((sum, p) => sum + p.amount, 0) : 0;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone,
        address,
        totalSpent,
        joined: c.createdAt,
        policiesCount: c._count.policies,
        applicationsCount: c._count.applications
      };
    });

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch customers' });
  }
});

// Get all payments (transactions)
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        policy: { include: { plan: { select: { name: true } } } }
      },
      orderBy: { payDate: 'desc' }
    });

    const formatted = payments.map(p => ({
      id: p.id,
      txnId: p.txnId,
      user: p.user.name,
      email: p.user.email,
      plan: p.policy?.plan?.name || 'Unknown Plan',
      amount: p.amount,
      status: p.status,
      payMode: p.payMode,
      date: p.payDate
    }));

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payments' });
  }
});

// Get all claims
router.get('/claims', async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        user: { select: { name: true, email: true } },
        policy: { select: { policyNo: true } }
      },
      orderBy: { applyDate: 'desc' }
    });

    const formatted = claims.map(c => ({
      id: c.id,
      claimId: c.claimId,
      user: c.user.name,
      email: c.user.email,
      policyNo: c.policy.policyNo,
      reason: c.claimReason,
      amount: c.amount,
      status: c.status,
      date: c.applyDate,
      description: c.description
    }));

    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch claims' });
  }
});

// Update claim status
router.put('/claims/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: { 
        status,
        solveDate: status !== 'Pending' ? new Date() : null
      }
    });
    
    // Emit real-time notification
    if (req.io) {
      req.io.to(claim.userId).emit('notification', {
        type: 'CLAIM_UPDATE',
        message: `Your claim ${claim.claimId} has been ${status}`,
        data: claim
      });
    }

    res.json({ status: 'success', data: claim });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update claim status' });
  }
});

// Change Admin Password
router.put('/change-password', requireSuperAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await prisma.user.findUnique({ where: { id: req.adminId } });
    if (!admin) return res.status(404).json({ status: 'error', message: 'Admin not found' });

    const validPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!validPassword) {
      return res.status(400).json({ status: 'error', message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.adminId },
      data: { password: hashedPassword }
    });

    res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ status: 'error', message: 'Failed to change password' });
  }
});

// Get all team members (Admins)
router.get('/team', requireSuperAdmin, async (req, res) => {
  try {
    const team = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch team members' });
  }
});

// Create a new team member
router.post('/team', requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.role === 'ADMIN') {
        return res.status(400).json({ status: 'error', message: 'User is already an Admin' });
      }
      // If they exist as a USER, just upgrade them
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });
      return res.json({ status: 'success', data: updated });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json({ status: 'success', data: newAdmin });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add team member' });
  }
});

// Remove a team member (Downgrade to USER)
router.delete('/team/:id', requireSuperAdmin, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.adminId) {
      return res.status(400).json({ status: 'error', message: 'Cannot remove yourself' });
    }

    await prisma.user.update({
      where: { id: req.params.id },
      data: { role: 'USER' }
    });

    res.json({ status: 'success', message: 'Team member removed' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ status: 'error', message: 'Failed to remove team member' });
  }
});

export default router;
