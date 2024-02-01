import jwt from 'jsonwebtoken';
import { API_BASE_URL } from '../config/development';
export const getToken = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Token is not present
    return null;
  }

  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload.exp) {
      // Unable to decode or missing expiration claim
      return null;
    }

    const expirationTime = decoded.payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // Check if the token will expire in the next 15 minutes
    if (expirationTime - currentTime < 15 * 60 * 1000) {
      // Token is about to expire, refresh it
      const refreshedToken = await refreshAccessToken(token);

      if (refreshedToken) {
        // Refresh successful, update the token and its expiration
        const newDecoded = jwt.decode(refreshedToken, { complete: true });
        const newExpiration = newDecoded.payload.exp * 1000;

        localStorage.setItem('token', refreshedToken);
        localStorage.setItem('tokenExpiration', newExpiration.toString());

        return refreshedToken;
      } else {
        // Refresh failed, handle accordingly (e.g., redirect to signin)
        console.error('Token refresh failed');
        return null;
      }
    }

    // Token is still valid, return it
    return token;
  } catch (error) {
    // Error decoding the token
    console.error('Error decoding token:', error);
    return null;
  }
};

const refreshAccessToken = async (currentToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.newAccessToken;
    } else {
      // Refresh failed, handle accordingly
      console.error('Token refresh failed');
      return null;
    }
  } catch (error) {
    // Error during token refresh
    console.error('Error refreshing token:', error);
    return null;
  }
};
