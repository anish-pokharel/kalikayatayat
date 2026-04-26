// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000/api',
// // apiUrl: 'https://kalbbackend-pnop.vercel.app/api',  // Has 'kalbbackend'   
// khalti: {
//     publicKey: 'live_public_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     secretKey: 'live_secret_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     returnUrl: 'https://your-domain.com/payment-callback'
//   }
// };
export const environment = {
  production: false,
  // Remove the extra 'b' - it should be 'kalbackend' not 'kalbbackend'
  apiUrl: 'https://kalbackend-pnop.vercel.app/api',  // ✅ Fixed URL
  khalti: {
    publicKey: 'live_public_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    secretKey: 'live_secret_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    returnUrl: 'https://kalikayatayat.netlify.app/payment-callback'  // Updated to your frontend domain
  }
};