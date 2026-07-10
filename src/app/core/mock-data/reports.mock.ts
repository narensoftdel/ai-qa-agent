import { Report } from '../models/report.model';

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    scanId: 's1',
    title: 'Executive Security Summary',
    scope: 'Finance Portal',
    owner: 'CISO Office',
    generatedAt: '2026-07-07 14:20',
    status: 'Completed',
    risk: 'Critical'
  },
  {
    id: 2,
    scanId: 's1',
    title: 'Authentication Review',
    scope: 'Finance Portal Admin Console',
    owner: 'GRC Team',
    generatedAt: '2026-07-06 09:45',
    status: 'Completed',
    risk: 'High'
  },
  {
    id: 3,
    scanId: 's1',
    title: 'Quarterly Compliance Attestation',
    scope: 'Finance Portal',
    owner: 'Compliance Team',
    generatedAt: '2026-07-05 11:10',
    status: 'Completed',
    risk: 'Medium'
  },

  {
    id: 4,
    scanId: 's2',
    title: 'Identity Provider Exposure Audit',
    scope: 'Azure AD Production',
    owner: 'AppSec Team',
    generatedAt: '2026-07-07 10:05',
    status: 'Completed',
    risk: 'High'
  },
  {
    id: 5,
    scanId: 's2',
    title: 'MFA Enforcement Gap Analysis',
    scope: 'Identity Platform',
    owner: 'GRC Team',
    generatedAt: '2026-07-06 15:32',
    status: 'Processing',
    risk: 'Medium'
  },
  {
    id: 6,
    scanId: 's2',
    title: 'Privileged Access Review',
    scope: 'Identity Admin Console',
    owner: 'CISO Office',
    generatedAt: '2026-07-04 08:52',
    status: 'Completed',
    risk: 'High'
  },

  {
    id: 7,
    scanId: 's3',
    title: 'Cloud Security Posture Baseline',
    scope: 'AWS Production',
    owner: 'Cloud Security Team',
    generatedAt: '2026-07-05 18:10',
    status: 'Completed',
    risk: 'Medium'
  },
  {
    id: 8,
    scanId: 's3',
    title: 'IAM Policy Hardening Report',
    scope: 'AWS Production',
    owner: 'Cloud Security Team',
    generatedAt: '2026-07-03 12:40',
    status: 'Queued',
    risk: 'Low'
  },

  {
    id: 9,
    scanId: 's4',
    title: 'Customer Portal Penetration Test Summary',
    scope: 'Customer Portal',
    owner: 'AppSec Team',
    generatedAt: '2026-07-06 19:05',
    status: 'Completed',
    risk: 'High'
  },
  {
    id: 10,
    scanId: 's4',
    title: 'PCI Readiness Assessment',
    scope: 'Customer Portal Checkout',
    owner: 'Compliance Team',
    generatedAt: '2026-07-06 20:15',
    status: 'Completed',
    risk: 'Medium'
  },
  {
    id: 11,
    scanId: 's4',
    title: 'Session Handling Deep Dive',
    scope: 'Customer Portal',
    owner: 'AppSec Team',
    generatedAt: '2026-07-05 09:22',
    status: 'Processing',
    risk: 'High'
  },

  {
    id: 12,
    scanId: 's5',
    title: 'Partner API Exposure Audit',
    scope: 'Partner API Gateway',
    owner: 'Platform Ops',
    generatedAt: '2026-07-05 16:48',
    status: 'Completed',
    risk: 'Medium'
  },
  {
    id: 13,
    scanId: 's5',
    title: 'Rate Limiting & Abuse Controls Review',
    scope: 'Partner API Gateway',
    owner: 'Platform Ops',
    generatedAt: '2026-07-04 13:27',
    status: 'Completed',
    risk: 'Low'
  },

  {
    id: 14,
    scanId: 's6',
    title: 'HR Portal Risk Assessment',
    scope: 'Employee Self-Service Portal',
    owner: 'GRC Team',
    generatedAt: '2026-07-07 07:15',
    status: 'Queued',
    risk: 'High'
  },
  {
    id: 15,
    scanId: 's6',
    title: 'Payroll Data Exposure Review',
    scope: 'Employee Self-Service Portal',
    owner: 'Compliance Team',
    generatedAt: '2026-07-06 21:40',
    status: 'Processing',
    risk: 'Medium'
  },
  {
    id: 16,
    scanId: 's6',
    title: 'Incident Response Report: Failed Scan',
    scope: 'Employee Self-Service Portal',
    owner: 'AppSec Team',
    generatedAt: '2026-07-06 16:30',
    status: 'Completed',
    risk: 'Medium'
  },

  {
    id: 17,
    scanId: 's7',
    title: 'Mobile Banking API Security Assessment',
    scope: 'Mobile Banking Backend',
    owner: 'CISO Office',
    generatedAt: '2026-07-04 09:05',
    status: 'Completed',
    risk: 'Critical'
  },
  {
    id: 18,
    scanId: 's7',
    title: 'Biometric Authentication Review',
    scope: 'Mobile Banking Backend',
    owner: 'AppSec Team',
    generatedAt: '2026-07-04 08:40',
    status: 'Completed',
    risk: 'High'
  },

  {
    id: 19,
    scanId: 's8',
    title: 'Vendor Onboarding Risk Profile',
    scope: 'Vendor Onboarding Platform',
    owner: 'GRC Team',
    generatedAt: '2026-07-07 12:05',
    status: 'Queued',
    risk: 'Low'
  },
  {
    id: 20,
    scanId: 's8',
    title: 'KYC Data Handling Review',
    scope: 'Vendor Onboarding Platform',
    owner: 'Compliance Team',
    generatedAt: '2026-07-07 12:10',
    status: 'Queued',
    risk: 'Medium'
  },
  {
    id: 21,
    scanId: 's8',
    title: 'Third-Party Access Assessment',
    scope: 'Vendor Onboarding Platform',
    owner: 'Platform Ops',
    generatedAt: '2026-07-06 17:55',
    status: 'Processing',
    risk: 'Medium'
  },

  {
    id: 22,
    scanId: 's9',
    title: 'Checkout Flow Security Assessment',
    scope: 'Checkout Experience',
    owner: 'AppSec Team',
    generatedAt: '2026-07-07 11:20',
    status: 'Processing',
    risk: 'High'
  },
  {
    id: 23,
    scanId: 's9',
    title: 'Payment Tokenization Review',
    scope: 'Checkout Experience',
    owner: 'Compliance Team',
    generatedAt: '2026-07-07 11:25',
    status: 'Queued',
    risk: 'Medium'
  },

  {
    id: 24,
    scanId: 's10',
    title: 'Internal Wiki Exposure Report',
    scope: 'Internal Wiki',
    owner: 'AppSec Team',
    generatedAt: '2026-07-03 19:02',
    status: 'Completed',
    risk: 'Medium'
  },
  {
    id: 25,
    scanId: 's10',
    title: 'Access Control Review: Wiki Admin',
    scope: 'Internal Wiki',
    owner: 'GRC Team',
    generatedAt: '2026-07-03 19:40',
    status: 'Completed',
    risk: 'Low'
  }
];
