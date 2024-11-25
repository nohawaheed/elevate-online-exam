export class AuthEndpoint {
  static LOGIN = '/api/v1/auth/signin';
  static REGISTER = '/api/v1/auth/signup';
  static CHANGE_PASSWORD =
    '/api/v1/auth/changePassword';
  static DELETE_ACCOUNT = '/api/v1/auth/deleteMe';
  static EDIT_PROFILE = '/api/v1/auth/editProfile';
  static LOG0UT = '/api/v1/auth/logout';
  static USER_INFO = '/api/v1/auth/profileData';
  static FORGET_PASSWORD =
    '/api/v1/auth/forgotPassword';
  static VERIFY_CODE =
    '/api/v1/auth/verifyResetCode';
  static RESET_PASSWORD =
    '/api/v1/auth/resetPassword';
}
