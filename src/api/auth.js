import { API_ROOT } from "../helpers/apiConfig";
import axios from "axios/index";

export const SmsOtp = `${API_ROOT}/api/v1/auth/otp/sms`;
export const CallOtp = `${API_ROOT}/api/v1/auth/otp/call`;
export const OtpVerify = `${API_ROOT}/api/v1/auth/otp/verify`;
export const OtpEmail = `${API_ROOT}/api/v1/auth/otp/email`;
export const EmailVerify = `${API_ROOT}/api/v1/auth/otp/emailVerify`;
export const GoogleSignup = `${API_ROOT}/api/v1/glogin`;

