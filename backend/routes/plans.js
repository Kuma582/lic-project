import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// Get all active plans (Public)
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { status: 'Active' }
    });
    res.json({ status: 'success', data: plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch plans' });
  }
});

// Get single plan details (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return res.status(404).json({ status: 'error', message: 'Plan not found' });
    res.json({ status: 'success', data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch plan details' });
  }
});

// Add a new plan (Admin)
router.post('/', async (req, res) => {
  try {
    // In a real app, verify admin JWT here
    const { name, description, category, premium, ageEligibility, policyTerm, sumAssuredRange } = req.body;
    
    const newPlan = await prisma.plan.create({
      data: {
        name,
        description,
        category,
        premium,
        ageEligibility,
        policyTerm,
        sumAssuredRange,
        status: 'Active'
      }
    });

    res.json({ status: 'success', message: 'Plan created successfully', data: newPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to create plan' });
  }
});

// Delete a plan (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plan.delete({ where: { id } });
    res.json({ status: 'success', message: 'Plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to delete plan' });
  }
});

export default router;
