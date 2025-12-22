// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official

// Level 1: Đơn giản nhất và cũng khá phổ biến, đó là mỗi user sẽ có một quyền hạn (permission) duy nhất

export const MOCK_ROLES_LEVEL_1 = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

export const MOCK_USER_LEVEL_1 = {
  ID: 'hwinkdev-sample-id-12345678',
  EMAIL: 'hwink.dev@gmail.com',
  PASSWORD: 'hwinkdev@123',
  ROLE: MOCK_ROLES_LEVEL_1.CLIENT
}