export const environment = {
  production: false,
  // apiUrl: 'http://localhost:3000/api'
    apiUrl: 'https://kalbbackend-pnop.vercel.app/api', // Changed from localhost
   khalti: {
    publicKey: 'live_public_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    secretKey: 'live_secret_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    returnUrl: 'https://your-domain.com/payment-callback'
  }
};