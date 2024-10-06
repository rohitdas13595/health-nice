import { GenderTypes } from "@/constants";
import { z } from "zod";
import { PatientData } from "./db/schema";

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(50, {
      message: "Username must be atmost 50 characters",
    }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const loginFormSchema = z.object({
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const otpFormSchema = z.object({
  otp: z.string().min(6, "Invalid OTP"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum([GenderTypes.Male, GenderTypes.Female, GenderTypes.Other]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

export const addDoctorSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(50, {
      message: "Name must be atmost 50 characters",
    }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),

  specialization: z
    .string()
    .min(3, {
      message: "Specialization must be at least 3 characters",
    })
    .max(50, {
      message: "Specialization must be atmost 50 characters",
    }),

  experience: z.string().refine((experience) => {
    const number = Number(experience);
    return !isNaN(number) && number >= 0 && number <= 100;
  }),

  fees: z.string().refine((fees) => {
    const number = Number(fees);
    return !isNaN(number) && number >= 0;
  }),
  address: z
    .string()
    .min(3, {
      message: "Address must be at least 3 characters",
    })
    .max(250, {
      message: "Address must be atmost 250 characters",
    }),
  avatar: z.string().optional(),
});


export const createAppointmentSchema = z.object({
  patientId: z
    .string().uuid( 
      "Invalid patient "
    ),
  patientDataId: z
    .string().uuid(
      "Invalid patient profile"
    ),
  doctorId: z
    .string().uuid(
      "Invalid doctor "
    ),
  time: z
    .date(
      
    )
   
}); 

