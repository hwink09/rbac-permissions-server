// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official

// Level 2: Vẫn là một user chỉ dược gắn với một vai trò (role) duy nhất, nhưng mỗi role có thể có thể có nhiều quyền hạn (permissions) khác nhau và được chia nhỏ ra

// CRUD: Create, Read, Update, Delete
export const MOCK_ROLES_LEVEL_2 = [
  // client
  {
    _id: 'role-client-sample-id-1234',
    name: 'client',
    permissions: [
      'create_support',
      'read_support',
      'update_support',
      'delete_support'
    ]
  },
  // moderator
  {
    _id: 'role-moderator-sample-id-1234',
    name: 'moderator',
    permissions: [
      // supports
      'create_support',
      'read_support',
      'update_support',
      'delete_support',
      // messages
      'create_messages',
      'read_messages',
      'update_messages',
      'delete_messages'
    ]
  },
  // admin
  {
    _id: 'role-admin-sample-id-1234',
    name: 'admin',
    permissions: [
      // supports
      'create_support',
      'read_support',
      'update_support',
      'delete_support',
      // messages
      'create_messages',
      'read_messages',
      'update_messages',
      'delete_messages',
      // admin-tools
      'create_admin_tools',
      'read_admin_tools',
      'update_admin_tools',
      'delete_admin_tools'
    ]
  }
]

export const MOCK_USER_LEVEL_2 = {
  ID: 'hwinkdev-sample-id-12345678',
  EMAIL: 'hwink.dev@gmail.com',
  PASSWORD: 'hwinkdev@123',
  ROLE: 'moderator' // Role name phải là unique và ăn đúng với bảng role trong DB như trên
}