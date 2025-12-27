// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official

/**
 * Level 3: Group Roles & Hierarchical RBAC
 * Group Roles: Một user có nhiều vai trò
 * Hierarchical RBAC: Vai trò có thể kế thừa quyền từ vai trò khác
 */

// CRUD: Create, Read, Update, Delete
export const MOCK_ROLES_LEVEL_3 = [
  // client
  {
    _id: 'role-client-sample-id-1234',
    name: 'client',
    permissions: [
      'create_support',
      'read_support',
      'update_support',
      'delete_support'
    ],
    inherits: [] // client không kế thừa permission từ role nào cả
  },
  // moderator
  {
    _id: 'role-moderator-sample-id-1234',
    name: 'moderator',
    permissions: [
      // messages
      'create_messages',
      'read_messages',
      'update_messages',
      'delete_messages'
    ],
    inherits: ['client'] // moderator kế thừa permission từ role client
  },
  // admin
  {
    _id: 'role-admin-sample-id-1234',
    name: 'admin',
    permissions: [
      // admin-tools
      'create_admin_tools',
      'read_admin_tools',
      'update_admin_tools',
      'delete_admin_tools'
    ],
    inherits: ['client', 'moderator'] // admin kế thừa permission từ role moderator
  }
]

export const MOCK_USER_LEVEL_3 = {
  ID: 'hwinkdev-sample-id-12345678',
  EMAIL: 'hwink.dev@gmail.com',
  PASSWORD: 'hwinkdev@123',
  // User lúc này có thể có nhiều roles. Lưu ý ở phía UI của FE RBAC phải cập nhật lại vì nó đang xử lí theo mỗi user một role
  // ROLES: ['client']
  ROLES: ['moderator']
  // ROLES: ['admin']
  // ROLES: ['client', 'moderator', 'admin']
}