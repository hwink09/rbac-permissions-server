// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { StatusCodes } from 'http-status-codes'
import { getPermissionsFromRole } from '~/utils/rbacUtils'

/**
 * Level 3: Group Roles & Hierarchical RBAC
 * Group Roles: Một user có nhiều vai trò
 * Hierarchical RBAC: Vai trò có thể kế thừa quyền từ vai trò khác
 */

// Nhận vào requiredPermissions là một mảng các permissions được phép truy cập API
const isValidPermission = (requiredPermissions) => {
  return async (req, res, next) => {

    try {
      // B1: Middlewarer RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT token phải hợp lệ và đã có dữ liệu decoded

      // B2: Lấy role của user trong dữ liệu payload decoded từ JWT token
      // Lưu ý: tủy mỗi loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì có những dự án sẽ query thẳng database để lấy thông tin user (bao gồm role/permission)
      const userRoles = req.jwtDecoded.role

      // B3: Kiểm tra role, user bắt buộc phải có ít nhất một role
      if (!Array.isArray(userRoles) || userRoles.length === 0) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: No roles provided' })
        return
      }

      // B4: Dựa theo mảng userRoles của user rồi tìm tiếp trong db để lấy đầy đủ thông tin của role dó
      // Đối với các thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set object để tối ưu hiệu năng xử lí (tìm kiếm / thêm / xóa) hơn là xử lí Array thông thường
      // VD: Array.includes() có độ phức tạp O(n) trong khi Set.has() có độ phức tạp O(1)
      let userPermissions = new Set()
      for (const roleName of userRoles) {
        const rolePermissions = await getPermissionsFromRole(roleName)
        rolePermissions.forEach(i => userPermissions.add(i))
      }

      // B5: Kiểm tra quyền truy cập ( Lưu ý: nếu không cung cấp mảng requiredPermissions hoặc requiredPermissions rỗng thì ý nghĩa ở đây thường là không check quyền => luôn cho phép truy cập API)
      // Hàm every của JS sẽ luôn trả về true nếu mảng truyền vào rỗng
      const hasPermission = requiredPermissions?.every(i => userPermissions.has(i))
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

export const rbacMiddlewarev3 = {
  isValidPermission
}