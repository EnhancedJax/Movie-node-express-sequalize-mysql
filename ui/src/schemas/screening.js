import * as yup from "yup";

export const SCREENING_SCHEMA = yup.object().shape({
  price: yup
    .number()
    .typeError("Must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  movieId: yup.string().uuid().required("Movie ID is required"),
  theaterId: yup.string().uuid().required("Theater ID is required"),
});
