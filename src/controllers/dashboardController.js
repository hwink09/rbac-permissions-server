// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { StatusCodes } from 'http-status-codes'

const access = async (req, res) => {
  try {
    const userInfo = {
      email: req.jwtDecoded.email,
      id: req.jwtDecoded.id,
      role: req.jwtDecoded.role
    }

    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access
}
