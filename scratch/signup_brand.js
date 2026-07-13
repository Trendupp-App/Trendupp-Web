const axios = require('/Users/newuser/Documents/Trendupp-Web/node_modules/axios');

const NEXT_PUBLIC_API_BASE_URL = 'https://trendupp-server.onrender.com/api/v1';
const NEXT_PUBLIC_API_KEY = 'TU-X3F7oj50dYYn083Bh7XviiUvOiM';

async function registerBrand() {
  const rand = Math.floor(Math.random() * 10000);
  const email = `brand_test_${rand}@trendupp.com`;
  const password = 'Password123!';
  const brandName = `Brand_${rand}`;
  const username = `brand_user_${rand}`;

  const signupPayload = {
    email,
    password,
    firstName: 'BrandFirst',
    lastName: 'BrandLast',
    role: 'brand',
    brandName,
    username,
    acceptedTerms: true,
  };

  try {
    console.log('Sending signup request...');
    const signupRes = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/auth/signup`, signupPayload, {
      headers: {
        'x-api-key': NEXT_PUBLIC_API_KEY,
      },
    });

    const message = signupRes.data.message;
    console.log('Signup Response Message:', message);

    // Parse the OTP code from the message
    // e.g. "Signup successful. Please verify your email with the OTP sent. Here is your OTP: 875107"
    const otpMatch = message.match(/Here is your OTP:\s*(\d+)/i);
    if (!otpMatch) {
      console.error('Could not find OTP code in message response!');
      return;
    }
    const code = otpMatch[1];
    console.log('Parsed OTP Code:', code);

    // Call verify OTP to authenticate and activate the brand account
    console.log('Sending verification request...');
    const verifyRes = await axios.post(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/otp/verify`,
      {
        email,
        code,
      },
      {
        headers: {
          'x-api-key': NEXT_PUBLIC_API_KEY,
        },
      },
    );

    console.log('\n=============================================');
    console.log('🎉 BRAND ACCOUNT CREATED AND ACTIVATED SUCCESS!');
    console.log('=============================================');
    console.log(`Email:      ${email}`);
    console.log(`Password:   ${password}`);
    console.log(`Brand Name: ${brandName}`);
    console.log(`User ID:    ${verifyRes.data.user?.id}`);
    console.log(`Token:      ${verifyRes.data.accessToken}`);
    console.log('=============================================\n');
  } catch (err) {
    console.error('Error in signup/verification process:', err.response?.data || err.message);
  }
}

registerBrand();
