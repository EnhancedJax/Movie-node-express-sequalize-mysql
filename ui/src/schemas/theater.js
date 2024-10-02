import * as yup from "yup";

export const THEATER_SCHEMA = yup.object().shape({
  name: yup.string().required("Name is required"),
  cinemaId: yup.string().uuid().required("Cinema ID is required"),
  screenDistance: yup
    .number()
    .typeError("Must be a number")
    .required("Screen distance is required"),
  seatLayout: yup
    .array()
    .of(yup.array().of(yup.number().typeError("Must be a number")))
    .required("Seat layout is required"),
});
