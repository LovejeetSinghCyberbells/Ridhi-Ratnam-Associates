export const APP_CONFIG = {
  NAME: 'Ridhi Ratnam Associates',
  SHORT_NAME: 'RRA',
  TAGLINE: 'YOUR FINANCIAL GROWTH PARTNER',
  SUBTITLE: 'Authorized Non-Banking Financial Advisory & Lending Partner',
  SUPPORT_PHONE: '+91 98765 43210',
  SUPPORT_EMAIL: 'support@ridhiratnam.com',
  AGENT_SUPPORT_EMAIL: 'agentdesk@ridhiratnam.com',
  OFFICIAL_WEBSITE: 'https://ridhiratnam.com',
  DEFAULT_BRANCH: 'Chandigarh Main Branch',
  REGULATORY_INFO: 'RBI NBFC REGULATED • DPDP ACT COMPLIANT',
  CURRENCY_SYMBOL: '₹',
  DEFAULT_INTEREST_RATE: '10.5% p.a.',
} as const;

export const LOAN_FACILITY_TYPES = [
  'Personal Loan',
  'Business Expansion',
  'Home Loan',
  'Loan Against Property',
  'Working Capital Limit',
  'Machinery & Equipment',
] as const;

export const APPLICATION_STATUSES = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
] as const;

export const STORAGE_KEYS = {
  USER_SESSION: '@rra_user_session',
  THEME_PREFERENCE: '@rra_theme_preference',
  BIOMETRIC_PREF: '@rra_biometric_enabled',
} as const;

