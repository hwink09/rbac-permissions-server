// Author: Hwinkdev: https://www.youtube.com/@hwinkdev.official
// https://www.npmjs.com/package/jsonwebtoken

import JWT from 'jsonwebtoken'

/**
 * Function tạo mới 1 token JWT - cần 3 tham số:
 * userInfo: thông tin muốn đính kèm vào token
 * secretSignature: chữ ký bí mật
 * tokenLife: thời gian sống của token
 */

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện JWT - thuật toán mặc định là HS256
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

/**
 * Fuction kiểm tra Token có hợp lệ hay không
 * => token tạo ra có đúng với secretSignature hay không
 */
const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify() của thư viện JWT
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}