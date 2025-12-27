// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
// import { rbacMiddlewarev1 } from '~/middlewares/rbacMiddlewarev1'
// import { rbacMiddlewarev2 } from '~/middlewares/rbacMiddlewarev2'
import { rbacMiddlewarev3 } from '~/middlewares/rbacMiddlewarev3'
// import { MOCK_ROLES_LEVEL_1 } from '~/models/mockDBv1'

const Router = express.Router()

Router.route('/access').get(authMiddleware.isAuthorized, dashboardController.access)

// Example: Chỉ cho phép ADMIN và MODARATOR truy cập vào API /messages
Router.route('/messages')
  .get(
    authMiddleware.isAuthorized,
    // rbacMiddlewarev1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN, MOCK_ROLES_LEVEL_1.MODERATOR]),
    // rbacMiddlewarev2.isValidPermission(['read_messages']),
    rbacMiddlewarev3.isValidPermission(['read_messages']),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Truy cập API GET: /messages thành công!' })
    }
  )

// Example: Chỉ cho phép ADMIN truy cập vào API /admin-tools
Router.route('/admin-tools')
  .get(
    authMiddleware.isAuthorized,
    // rbacMiddlewarev1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN]),
    // rbacMiddlewarev2.isValidPermission(['read_admin_tools']),
    rbacMiddlewarev3.isValidPermission(['read_admin_tools']),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Truy cập API GET: /admin-tools thành công!' })
    }
  )

export const dashboardRoute = Router
