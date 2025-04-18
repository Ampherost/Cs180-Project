'use client';
import axios from 'axios';
import { businessSchema, candidateSchema } from './lib/schemas';

export async function handleSubmit(state, formData,isBusiness) {

  // URL based on form type
  const url = isBusiness ? 'http://127.0.0.1:8000/signup/business' : 'http://127.0.0.1:8000/signup/candidates';

  // Payload construction based on form type
  const payload = isBusiness 
  ? {
      business_name: formData.get('business_name') || '',
      business_email: formData.get('business_email') || '',
      position_title: formData.get('position_title') || '',
      password: formData.get('password') || '',
      confirm_password: formData.get('confirm_password') || '',
      role: 'business'
    }
  : {
      first_name: formData.get('first_name') || '',
      last_name: formData.get('last_name') || '',
      email: formData.get('email') || '',
      password: formData.get('password') || '',
      confirm_password: formData.get('confirm_password') || '',
      role: 'candidate'
    };

  console.log('Payload being sent:', payload);

  const schema = isBusiness ? businessSchema : candidateSchema;

  // Validating errors
  const parsed = schema.safeParse(payload);

  // If validation fails, return errors to the frontend
  if (!parsed.success) {
    const validationErrors = parsed.error.flatten().fieldErrors;
    console.log('Validation errors:', validationErrors);
    return {
      success: false,
      message: 'Invalid data, please check your input.',
      errors: validationErrors, 
      default_values : payload
    };
  }

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    // Return successful response data
    return {
      success: true,
      [isBusiness ? 'business' : 'candidate']: response.data[isBusiness ? 'business' : 'candidate'],
    };

  } catch (e) {
    if (e.response) {
      // If server returns an error response
      console.log('Error response data:', e.response.data.detail);
      return {
        success: false,
        message: e.response.data.detail || 'Unknown server error.',
      };
    } else {
      // If there was a network or unexpected error
      console.error('Network or unexpected error:', e.message);
      return {
        success: false,
        message: "Can't reach the server",
      };
    }
  }
}
