// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
import { MOCK_ROLES_LEVEL_3 } from '~/models/mockDBv3'

// Lấy tất cả permissions từ một role, bao gồm cả permissions kế thừa từ các role khác
export const getPermissionsFromRole = async (roleName) => {
  // Thực tế ở đây phải await query database nên cứ để function là async
  const role = MOCK_ROLES_LEVEL_3.find(i => i.name === roleName)
  if (!role) return [] // Nếu không tìm thấy role thì trả về mảng rỗng, nghĩa là không có permission

  // Đối với các thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set object để tối ưu hiệu năng xử lí (tìm kiếm / thêm / xóa) hơn là xử lí Array thông thường
  // VD: Array.includes() có độ phức tạp O(n) trong khi Set.has() có độ phức tạp O(1)
  let permissions = new Set(role.permissions)

  // Xử lí kế thừa nếu như role có tồn tại field inherits với dữ liệu
  if (Array.isArray(role.inherits) && role.inherits.length > 0) {
    for (const inheritedRoleName of role.inherits) {
      // Đệ quy lại chính function này để lấy toàn bộ permissions của role hiện tại
      const inheritedPermissions = await getPermissionsFromRole(inheritedRoleName)
      inheritedPermissions.forEach(i => permissions.add(i)) // Thêm từng permission vào Set permissions
    }
  }

  // Trả về kết quả là một mảng các permissions nên sẽ dùng Array.from() vì permissions là một Set object
  return Array.from(permissions)
}