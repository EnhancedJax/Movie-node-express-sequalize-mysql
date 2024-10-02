import * as yup from "yup";

export const MOVIE_SCHEMA = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  duration: yup
    .number()
    .typeError("Must be a number")
    .required("Duration is required"),
  releaseDate: yup.date().required("Release date is required"),
});
