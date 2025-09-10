export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  tenantId: '',
  auth: {
    clientId: '',
    redirectUri: 'http://localhost:4200/auth/callback',
    authority: 'https://login.microsoftonline.com/???',
  },
  featureFlags: {
    enableExperimentalFeature: true,
  },
};
