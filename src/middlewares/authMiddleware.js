// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'

// Middleware: Validate JWT accessToken from client cookies
const isAuthorized = async (req, res, next) => {
  // Get accessToken from httpOnly cookie sent by client (with withCredentials)
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: No access token provided' })
    return
  }

  try {
    // Step 1: Verify and decode the accessToken
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Step 2: (IMPORTANT) Store decoded token info in req.jwtDecoded for downstream handlers
    req.jwtDecoded = accessTokenDecoded

    // Step 3: Allow request to proceed
    next()
  } catch (error) {
    // Case 1: If accessToken is expired, return GONE (410) so frontend can refresh token
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Unauthorized: Token expired' })
      return
    }
    // Case 2: If accessToken is invalid, return UNAUTHORIZED (401) for logout/re-authentication
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token. Please login again.' })
  }
}

export const authMiddleware = {
  isAuthorized
}