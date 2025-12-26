// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { StatusCodes } from 'http-status-codes'
import { MOCK_ROLES_LEVEL_2 } from '~/models/mockDBv2'

// Middleware: RBAC v2 - nhận tham số đầu vào là một mảng các permissions được phép truy cập API
// Nhận vào requiredPermissions là một mảng các permissions được phép truy cập API
const isValidPermission = (requiredPermissions) => {
  return async (req, res, next) => {

    try {
      // B1: Middlewarer RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT token phải hợp lệ và đã có dữ liệu decoded

      // B2: Lấy role của user trong dữ liệu payload decoded từ JWT token
      // Lưu ý: tủy mỗi loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì có những dự án sẽ query thẳng database để lấy thông tin user (bao gồm role/permission)
      const userRole = req.jwtDecoded.role

      // B3: Kiểm tra role
      if (!userRole) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: Role not provided' })
        return
      }

      // B4: Dựa theo role của user rồi tìm tiếp trong db để lấy đầy đủ thông tin của role dó
      const fullUserRole = MOCK_ROLES_LEVEL_2.find(i => i.name === userRole)
      if (!fullUserRole) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: Role not found' })
        return
      }

      // B5: Kiểm tra quyền truy cập ( Lưu ý: nếu không cung cấp mảng requiredPermissions hoặc requiredPermissions rỗng thì ý nghĩa ở đây thường là không check quyền => luôn cho phép truy cập API)
      // Hàm every của JS sẽ luôn trả về true nếu mảng truyền vào rỗng
      const hasPermission = requiredPermissions?.every(i => fullUserRole.permissions.includes(i))
      if (!hasPermission) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: You do not have permission to access this API' })
        return
      }

      // B6: Nếu role và permission hợp lệ, cho phép request đi tiếp
      next()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ isValidPermission ~ error:', error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Oops! Something went wrong on the server.' })
    }
  }
}

export const rbacMiddlewarev2 = {
  isValidPermission
}