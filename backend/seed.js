import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding plans into database...');

  const plans = [
    {
      name: 'LIC Jeevan Anand',
      description: 'A combination of whole life and endowment assurance plan. Provides financial protection against death throughout the lifetime with provision of payment of lumpsum at the end of the selected policy term.',
      category: 'Endowment',
      premium: '₹2,500/month',
      ageEligibility: '18 - 50 Years',
      policyTerm: '15 - 35 Years',
      sumAssuredRange: 'Min ₹1,00,000'
    },
    {
      name: 'LIC Jeevan Umang',
      description: 'Offers income and protection to your family. This plan provides for annual survival benefits from the end of the premium paying term till maturity and a lump sum payment at the time of maturity or on survival to age 100.',
      category: 'Whole Life',
      premium: '₹3,200/month',
      ageEligibility: '90 Days - 55 Years',
      policyTerm: '15, 20, 25, 30 Years',
      sumAssuredRange: 'Min ₹2,00,000'
    },
    {
      name: 'LIC Tech-Term',
      description: 'A non-linked, without profit, pure protection online term assurance policy which provides financial protection to the insured\'s family in case of unfortunate death of the policyholder.',
      category: 'Term Life',
      premium: '₹800/month',
      ageEligibility: '18 - 65 Years',
      policyTerm: '10 - 40 Years',
      sumAssuredRange: 'Min ₹50,00,000'
    },
    {
      name: 'LIC Bima Jyoti',
      description: 'A non-linked, non-participating, individual, life insurance savings plan which offers an attractive combination of protection and savings with guaranteed additions.',
      category: 'Endowment',
      premium: '₹4,500/month',
      ageEligibility: '90 Days - 60 Years',
      policyTerm: '15 - 20 Years',
      sumAssuredRange: 'Min ₹1,00,000'
    },
    {
      name: 'LIC Jeevan Labh',
      description: 'A limited premium paying, non-linked, with-profits endowment plan which offers a combination of protection and savings.',
      category: 'Endowment',
      premium: '₹3,000/month',
      ageEligibility: '8 - 59 Years',
      policyTerm: '16, 21, 25 Years',
      sumAssuredRange: 'Min ₹2,00,000'
    },
    {
      name: 'LIC Jeevan Lakshya',
      description: 'A participating non-linked plan which offers a combination of protection and savings. Provides Annual Income Benefit that may help to fulfill the needs of the family.',
      category: 'Endowment',
      premium: '₹2,800/month',
      ageEligibility: '18 - 50 Years',
      policyTerm: '13 - 25 Years',
      sumAssuredRange: 'Min ₹1,00,000'
    },
    {
      name: 'LIC Bima Ratna',
      description: 'A Non-Linked, Non-Participating, Individual, Savings, Life Insurance Plan which offers a combination of protection and savings with Guaranteed Additions.',
      category: 'Money Back',
      premium: '₹5,000/month',
      ageEligibility: '90 Days - 55 Years',
      policyTerm: '15, 20, 25 Years',
      sumAssuredRange: 'Min ₹5,00,000'
    },
    {
      name: 'LIC Dhan Sanchay',
      description: 'A non-linked, non-participating, individual, savings life insurance plan which offers a combination of protection and savings.',
      category: 'Endowment',
      premium: '₹4,000/month',
      ageEligibility: '3 - 65 Years',
      policyTerm: '5 - 15 Years',
      sumAssuredRange: 'Min ₹3,30,000'
    },
    {
      name: 'LIC Jeevan Tarun',
      description: 'A participating non-linked limited premium payment plan which offers an attractive combination of protection and saving features for children.',
      category: 'Child Plan',
      premium: '₹2,000/month',
      ageEligibility: '90 Days - 12 Years',
      policyTerm: '20 - 25 Years',
      sumAssuredRange: 'Min ₹75,000'
    }
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.plan.findFirst({
      where: { name: plan.name }
    });

    if (!existingPlan) {
      await prisma.plan.create({
        data: {
          ...plan,
          status: 'Active'
        }
      });
      console.log(`Created plan: ${plan.name}`);
    } else {
      await prisma.plan.update({
        where: { id: existingPlan.id },
        data: {
          ...plan,
          status: 'Active'
        }
      });
      console.log(`Updated plan: ${plan.name}`);
    }
  }

  console.log('Plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
