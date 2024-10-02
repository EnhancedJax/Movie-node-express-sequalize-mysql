import * as yup from "yup";

export const CINEMA_SCHEMA = yup.object().shape({
  name: yup.string().required("Name is required"),
  location: yup.string().required("Location is required"),
  lat: yup
    .number()
    .typeError("Must be a number")
    .required("Latitude is required"),
  lng: yup
    .number()
    .typeError("Must be a number")
    .required("Longitude is required"),
});
