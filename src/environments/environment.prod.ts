

export const environment = {
  production: false,
  // Remove the extra 'b' - it should be 'kalbackend' not 'kalbbackend'
  // apiUrl: 'https://kalbackend-pnop.vercel.app/api',  // Note: 'kalbackend' not 'kalbbackend'
  apiUrl: 'http://localhost:3000/api',

  khalti: {
    publicKey: 'test_public_key_0275cc5e2bae42fb890536aae01e9e73',
    // secretKey: 'live_secret_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    returnUrl: 'https://kalikayatayat.netlify.app/payment-callback'  // Updated to your frontend domain
  }
};