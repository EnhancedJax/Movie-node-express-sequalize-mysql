import * as yup from "yup";

export const EMAIL_SCHEMA = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const PASSWORD_SCHEMA = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmNewPassword: yup
    .string()
    .required("Confirm new password is required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
