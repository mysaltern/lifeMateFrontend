// authMiddleware.ts

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { API_SECRET } from '../config/development'; // Update with your actual secret key

const authMiddleware: (handler: NextApiHandler) => NextApiHandler = (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    // Token is missing, redirect to login page
    res.writeHead(302, { Location: '/signin' });
    res.end();
    return;
  }

  try {
    // Verify the token using your secret key
    const decodedToken = verify(token, API_SECRET) as { /* your token payload type */ };
    
    // You can also perform additional checks on the decodedToken if needed

    // Attach the decoded token to the request for further use
    req.user = decodedToken;

    return handler(req, res);
  } catch (error) {
    // Token is invalid, redirect to login page
    res.writeHead(302, { Location: '/signin' });
    res.end();
  }
};

export default authMiddleware;
