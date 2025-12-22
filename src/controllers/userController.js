// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official

import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ms from 'ms'
import { MOCK_USER_LEVEL_1 } from '~/models/mockDBv1'


const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_USER_LEVEL_1.EMAIL || req.body.password !== MOCK_USER_LEVEL_1.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Tạo thông tin (payload) để đính kèm trong JWT token
    const userInfo = {
      id: MOCK_USER_LEVEL_1.ID,
      email: MOCK_USER_LEVEL_1.EMAIL,
      role: MOCK_USER_LEVEL_1.ROLE
    }

    // Create JWT tokens
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    /**
     * Set httpOnly cookies for client
     * maxAge: cookie lifetime (14 days - adjust per project needs)
     * Note: Cookie lifetime differs from token lifetime for security flexibility
     * httpOnly: Prevents JavaScript access (XSS protection)
     * secure: Only sent over HTTPS (set to true in production)
     * sameSite: 'none' allows cross-site requests (required for separate FE/BE origins)
     */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Return user info (tokens are in httpOnly cookies, not response body)
    res.status(StatusCodes.OK).json({ ...userInfo })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Clear httpOnly cookies - opposite of setting them in login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Get refreshToken from httpOnly cookie sent with request
    const refreshTokenFromCookie = req.cookies?.refreshToken

    // Verify/decode refreshToken
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Extract user info from decoded token (saves a database query)
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
    }

    // Generate new accessToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    // Set new accessToken cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Return success (new accessToken is in httpOnly cookie)
    res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully' })
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh token is invalid or expired.' })
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
