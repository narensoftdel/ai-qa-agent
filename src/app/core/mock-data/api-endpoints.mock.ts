import { ApiEndpoint, ApiRiskLevel, HttpMethod } from '../models/api-endpoint.model';

type EndpointRow = [HttpMethod, string, string, number, boolean, ApiRiskLevel];

interface ApiGroup {
  scanId: string;
  pageIds: [string, string];
  endpoints: EndpointRow[];
}

/** Ten endpoints per scan, alternating ownership across that scan's two captured pages, for 100 endpoints total. */
const API_GROUPS: ApiGroup[] = [
  {
    scanId: 's1',
    pageIds: ['p1', 'p2'],
    endpoints: [
      [
        'POST',
        '/api/auth/login',
        'Authenticates a user and issues a session token',
        200,
        false,
        'Medium'
      ],
      ['GET', '/api/session', 'Returns the current session state', 200, true, 'Low'],
      ['GET', '/api/accounts', 'Lists accounts owned by the authenticated user', 200, true, 'Low'],
      [
        'GET',
        '/api/accounts/{id}/balance',
        'Returns the balance for a given account',
        200,
        true,
        'Medium'
      ],
      [
        'POST',
        '/api/accounts/transfer',
        'Initiates a funds transfer between accounts',
        200,
        true,
        'Critical'
      ],
      ['GET', '/api/transactions', 'Lists recent transactions for an account', 200, true, 'Low'],
      [
        'POST',
        '/api/accounts/transfer/confirm',
        'Confirms a pending funds transfer',
        200,
        true,
        'High'
      ],
      ['GET', '/api/notifications', 'Lists in-app notifications for the user', 200, true, 'Info'],
      ['GET', '/api/profile', 'Returns the authenticated user profile', 200, true, 'Low'],
      ['POST', '/api/auth/logout', 'Invalidates the current session', 204, true, 'Info']
    ]
  },
  {
    scanId: 's2',
    pageIds: ['p3', 'p4'],
    endpoints: [
      [
        'POST',
        '/api/sso/token',
        'Exchanges an SSO authorization code for tokens',
        200,
        false,
        'High'
      ],
      [
        'GET',
        '/api/sso/callback',
        'Handles the identity provider redirect callback',
        302,
        false,
        'Medium'
      ],
      ['GET', '/api/users', 'Lists directory users visible to the caller', 200, true, 'Medium'],
      ['GET', '/api/users/{id}', 'Returns profile details for a specific user', 200, true, 'High'],
      [
        'PATCH',
        '/api/users/{id}/roles',
        'Updates the role assignments for a user',
        200,
        true,
        'Critical'
      ],
      [
        'POST',
        '/api/mfa/enroll',
        'Enrolls a new multi-factor authentication device',
        200,
        true,
        'Medium'
      ],
      [
        'POST',
        '/api/mfa/verify',
        'Verifies a submitted multi-factor authentication code',
        200,
        true,
        'Medium'
      ],
      ['GET', '/api/audit-log', 'Returns recent identity platform audit events', 200, true, 'Low'],
      [
        'DELETE',
        '/api/users/{id}/sessions',
        'Revokes all active sessions for a user',
        204,
        true,
        'High'
      ],
      ['GET', '/api/directory/groups', 'Lists security groups in the directory', 200, true, 'Low']
    ]
  },
  {
    scanId: 's3',
    pageIds: ['p5', 'p6'],
    endpoints: [
      ['GET', '/api/buckets', 'Lists cloud storage buckets in the account', 200, true, 'Medium'],
      [
        'GET',
        '/api/buckets/{name}/acl',
        'Returns the access control list for a bucket',
        200,
        true,
        'High'
      ],
      [
        'PUT',
        '/api/buckets/{name}/policy',
        'Replaces the bucket access policy document',
        200,
        true,
        'Critical'
      ],
      ['GET', '/api/iam/roles', 'Lists IAM roles defined in the account', 200, true, 'Medium'],
      [
        'GET',
        '/api/iam/policies/{id}',
        'Returns the JSON document for an IAM policy',
        200,
        true,
        'Medium'
      ],
      ['POST', '/api/iam/roles/assign', 'Assigns an IAM role to a principal', 200, true, 'High'],
      ['GET', '/api/instances', 'Lists compute instances in the account', 200, true, 'Low'],
      [
        'GET',
        '/api/instances/{id}/security-groups',
        'Returns security group rules for an instance',
        200,
        true,
        'Medium'
      ],
      ['GET', '/api/billing/usage', 'Returns current billing usage metrics', 200, true, 'Info'],
      [
        'GET',
        '/api/cloudtrail/events',
        'Returns recent control-plane audit events',
        200,
        true,
        'Low'
      ]
    ]
  },
  {
    scanId: 's4',
    pageIds: ['p7', 'p8'],
    endpoints: [
      ['GET', '/api/account/profile', 'Returns the customer profile', 200, true, 'Low'],
      ['PATCH', '/api/account/profile', 'Updates customer profile fields', 200, true, 'Medium'],
      ['GET', '/api/orders', 'Lists orders placed by the customer', 200, true, 'Low'],
      ['GET', '/api/orders/{id}', 'Returns detail for a specific order', 200, true, 'Medium'],
      ['POST', '/api/orders/{id}/cancel', 'Cancels a pending order', 200, true, 'Medium'],
      ['GET', '/api/addresses', 'Lists saved shipping addresses', 200, true, 'Low'],
      ['POST', '/api/addresses', 'Creates a new shipping address', 201, true, 'Low'],
      ['GET', '/api/wishlist', 'Returns the customer wishlist', 200, true, 'Info'],
      [
        'GET',
        '/api/loyalty/points',
        'Returns the customer loyalty point balance',
        200,
        true,
        'Info'
      ],
      ['POST', '/api/support/tickets', 'Creates a customer support ticket', 201, true, 'Low']
    ]
  },
  {
    scanId: 's5',
    pageIds: ['p9', 'p10'],
    endpoints: [
      ['GET', '/api/gateway/routes', 'Lists configured API gateway routes', 200, true, 'Medium'],
      ['POST', '/api/gateway/keys', 'Issues a new partner API key', 201, true, 'High'],
      [
        'DELETE',
        '/api/gateway/keys/{id}',
        'Revokes an existing partner API key',
        204,
        true,
        'Medium'
      ],
      ['GET', '/api/gateway/usage', 'Returns request volume metrics per partner', 200, true, 'Low'],
      [
        'GET',
        '/api/gateway/docs/openapi.json',
        'Returns the published OpenAPI specification',
        200,
        false,
        'Info'
      ],
      [
        'POST',
        '/api/gateway/webhooks',
        'Registers a webhook destination for a partner',
        201,
        true,
        'High'
      ],
      ['GET', '/api/gateway/rate-limits', 'Returns configured rate limit tiers', 200, true, 'Low'],
      [
        'GET',
        '/api/partners/{id}',
        'Returns profile details for a partner account',
        200,
        true,
        'Medium'
      ],
      [
        'PATCH',
        '/api/partners/{id}/tier',
        'Updates the service tier for a partner',
        200,
        true,
        'Medium'
      ],
      ['GET', '/api/gateway/health', 'Returns gateway health and uptime status', 200, false, 'Info']
    ]
  },
  {
    scanId: 's6',
    pageIds: ['p11', 'p12'],
    endpoints: [
      ['GET', '/api/payslips', 'Lists payslips available to the employee', 200, true, 'Medium'],
      [
        'GET',
        '/api/payslips/{id}/download',
        'Downloads a payslip as a PDF document',
        200,
        true,
        'Medium'
      ],
      [
        'GET',
        '/api/benefits/plans',
        'Lists benefits plans available for enrollment',
        200,
        true,
        'Low'
      ],
      ['POST', '/api/benefits/enroll', 'Enrolls the employee in a benefits plan', 200, true, 'Low'],
      ['GET', '/api/employees/{id}', 'Returns employee record details', 200, true, 'High'],
      [
        'PATCH',
        '/api/employees/{id}/banking-details',
        'Updates direct deposit banking details',
        200,
        true,
        'Critical'
      ],
      ['GET', '/api/timeoff/balance', 'Returns remaining time-off balance', 200, true, 'Info'],
      ['POST', '/api/timeoff/requests', 'Submits a new time-off request', 201, true, 'Low'],
      ['GET', '/api/org-chart', 'Returns the organizational reporting structure', 200, true, 'Low'],
      ['POST', '/api/documents/upload', 'Uploads a supporting HR document', 201, true, 'High']
    ]
  },
  {
    scanId: 's7',
    pageIds: ['p13', 'p14'],
    endpoints: [
      ['POST', '/api/mbanking/auth/pin', 'Validates the mobile banking PIN', 200, false, 'High'],
      ['GET', '/api/mbanking/accounts', 'Lists linked bank accounts', 200, true, 'Medium'],
      [
        'GET',
        '/api/mbanking/transactions',
        'Lists recent account transactions',
        200,
        true,
        'Medium'
      ],
      [
        'POST',
        '/api/mbanking/transfers/p2p',
        'Initiates a peer-to-peer transfer',
        200,
        true,
        'Critical'
      ],
      ['POST', '/api/mbanking/cards/freeze', 'Freezes a debit or credit card', 200, true, 'Medium'],
      [
        'GET',
        '/api/mbanking/statements/{id}',
        'Downloads a monthly account statement',
        200,
        true,
        'Medium'
      ],
      [
        'POST',
        '/api/mbanking/support/chat',
        'Sends a message to the support chat channel',
        201,
        true,
        'Low'
      ],
      ['GET', '/api/mbanking/notifications', 'Lists push notification history', 200, true, 'Info'],
      [
        'POST',
        '/api/mbanking/biometric/register',
        'Registers a biometric authentication factor',
        200,
        true,
        'High'
      ],
      [
        'GET',
        '/api/mbanking/exchange-rates',
        'Returns current foreign exchange rates',
        200,
        false,
        'Info'
      ]
    ]
  },
  {
    scanId: 's8',
    pageIds: ['p15', 'p16'],
    endpoints: [
      [
        'POST',
        '/api/onboarding/kyc/submit',
        'Submits KYC verification documents',
        201,
        true,
        'High'
      ],
      ['GET', '/api/onboarding/kyc/status', 'Returns the KYC review status', 200, true, 'Medium'],
      [
        'POST',
        '/api/onboarding/contracts/upload',
        'Uploads a signed vendor contract',
        201,
        true,
        'Medium'
      ],
      [
        'GET',
        '/api/onboarding/contracts/{id}',
        'Returns metadata for an uploaded contract',
        200,
        true,
        'Low'
      ],
      [
        'POST',
        '/api/onboarding/bank-details',
        'Submits vendor payout banking details',
        200,
        true,
        'Critical'
      ],
      ['GET', '/api/vendors', 'Lists vendors in the onboarding pipeline', 200, true, 'Low'],
      [
        'GET',
        '/api/vendors/{id}/compliance',
        'Returns compliance checklist status for a vendor',
        200,
        true,
        'Medium'
      ],
      ['POST', '/api/vendors/{id}/approve', 'Approves a vendor for onboarding', 200, true, 'High'],
      [
        'GET',
        '/api/onboarding/checklist',
        'Returns the onboarding checklist template',
        200,
        true,
        'Info'
      ],
      [
        'POST',
        '/api/onboarding/notify',
        'Sends an onboarding status notification',
        202,
        true,
        'Low'
      ]
    ]
  },
  {
    scanId: 's9',
    pageIds: ['p17', 'p18'],
    endpoints: [
      ['GET', '/api/cart', 'Returns the current shopping cart contents', 200, false, 'Low'],
      ['POST', '/api/cart/items', 'Adds an item to the shopping cart', 201, false, 'Low'],
      [
        'POST',
        '/api/checkout/payment',
        'Submits payment card details for checkout',
        200,
        true,
        'Critical'
      ],
      [
        'POST',
        '/api/checkout/payment/3ds-callback',
        'Handles the 3-D Secure challenge callback',
        200,
        false,
        'High'
      ],
      [
        'GET',
        '/api/checkout/shipping-options',
        'Lists available shipping options',
        200,
        false,
        'Info'
      ],
      [
        'POST',
        '/api/checkout/apply-coupon',
        'Applies a discount code to the order',
        200,
        false,
        'Medium'
      ],
      [
        'GET',
        '/api/checkout/order-summary',
        'Returns the pre-payment order summary',
        200,
        true,
        'Low'
      ],
      [
        'POST',
        '/api/checkout/confirmation',
        'Finalizes the order after payment capture',
        201,
        true,
        'Medium'
      ],
      [
        'GET',
        '/api/checkout/tax-estimate',
        'Returns an estimated tax amount for the order',
        200,
        false,
        'Info'
      ],
      [
        'POST',
        '/api/checkout/gift-card/redeem',
        'Redeems a gift card balance toward the order',
        200,
        true,
        'Medium'
      ]
    ]
  },
  {
    scanId: 's10',
    pageIds: ['p19', 'p20'],
    endpoints: [
      ['GET', '/api/wiki/search', 'Searches wiki pages by keyword', 200, false, 'Low'],
      ['GET', '/api/wiki/pages/{id}', 'Returns the content of a wiki page', 200, false, 'Medium'],
      ['POST', '/api/wiki/pages', 'Creates a new wiki page', 201, true, 'Medium'],
      ['PATCH', '/api/wiki/pages/{id}', 'Updates an existing wiki page', 200, true, 'Medium'],
      [
        'GET',
        '/api/wiki/admin/users',
        'Lists wiki users and their access levels',
        200,
        true,
        'High'
      ],
      [
        'POST',
        '/api/wiki/admin/permissions',
        'Updates namespace permission grants',
        200,
        true,
        'High'
      ],
      [
        'GET',
        '/api/wiki/attachments/{id}',
        'Downloads a file attached to a wiki page',
        200,
        false,
        'Medium'
      ],
      ['DELETE', '/api/wiki/pages/{id}', 'Deletes a wiki page', 204, true, 'Medium'],
      [
        'GET',
        '/api/wiki/revisions/{id}',
        'Returns the revision history for a page',
        200,
        false,
        'Low'
      ],
      [
        'POST',
        '/api/wiki/export',
        'Exports a namespace as a downloadable archive',
        202,
        true,
        'High'
      ]
    ]
  }
];

function contentTypeFor(endpoint: string): string {
  if (
    endpoint.includes('download') ||
    endpoint.includes('export') ||
    endpoint.includes('statements')
  ) {
    return 'application/octet-stream';
  }
  return 'application/json';
}

export const MOCK_API_ENDPOINTS: ApiEndpoint[] = API_GROUPS.flatMap((group, groupIndex) =>
  group.endpoints.map(
    ([method, endpoint, description, statusCode, authRequired, riskLevel], endpointIndex) => {
      const globalIndex = groupIndex * 10 + endpointIndex;
      return {
        id: `api${globalIndex + 1}`,
        scanId: group.scanId,
        pageId: group.pageIds[endpointIndex % 2],
        method,
        endpoint,
        description,
        statusCode,
        responseTimeMs: 45 + ((globalIndex * 53) % 950),
        authRequired,
        contentType: contentTypeFor(endpoint),
        riskLevel
      };
    }
  )
);
