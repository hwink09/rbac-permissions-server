// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { StatusCodes } from 'http-status-codes'

// Middleware: RBAC v1 - nhận vào allowedRoles là một mảng những role được phép truy cập vào API
const isValidPermission = (allowedRoles) => {
  return async (req, res, next) => {

    try {
      // B1: Middlewarer RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT token phải hợp lệ và đã có dữ liệu decoded

      // B2: Lấy role của user trong dữ liệu payload decoded từ JWT token
      // Lưu ý: tủy mỗi loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì có những dự án sẽ query thẳng database để lấy thông tin user (bao gồm role/permission)
      const userRole = req.jwtDecoded.role

      // B3: Kiểm tra role, nếu user không tồn tại role hoặc role không thực scope được phép truy cập API
      if (!userRole || !allowedRoles.includes(userRole)) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: You do not have permission to access this resource' })
        return
      }

      // B4: Nếu role hợp lệ, cho phép request đi tiếp
      next()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ isValidPermission ~ error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Oops! Something went wrong on the server.' })
    }
  }
}

export const rbacMiddlewarev1 = {
  isValidPermission
}