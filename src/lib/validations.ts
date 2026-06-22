import { z } from "zod";

export const step1Schema = z.object({
  npc: z.string().min(1, "NPC is required"),
  reportedBy: z.string().min(1, "Reported by is required"),
  dateOfReport: z.string().min(1, "Date of report is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export type Step1Input = z.infer<typeof step1Schema>;

export const injurySchema = z.object({
  accreditationNo: z.string().min(1, "Accreditation number is required"),
  sportEvent: z.string().min(1, "Sport / event is required"),
  roundHeat: z.string().optional(),
  injuryDate: z.string().min(1, "Injury date is required"),
  injuryTime: z.string().optional(),
  bodyPart: z.string().min(1, "Body part is required"),
  bodyPartCode: z.string().optional(),
  injuryType: z.string().min(1, "Injury type is required"),
  injuryTypeCode: z.string().optional(),
  causeOfInjury: z.string().optional(),
  causeCode: z.string().optional(),
  absenceDays: z.coerce.number().optional(),
});

export type InjuryInput = z.infer<typeof injurySchema>;

export const illnessSchema = z.object({
  accreditationNo: z.string().min(1, "Accreditation number is required"),
  sportEvent: z.string().min(1, "Sport / event is required"),
  occurredOn: z.string().min(1, "Occurred on date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  affectedSystem: z.string().optional(),
  systemCode: z.string().optional(),
  mainSymptoms: z.string().optional(),
  symptomCodes: z.string().optional(),
  causeOfIllness: z.string().optional(),
  causeCode: z.string().optional(),
  absenceDays: z.coerce.number().optional(),
});

export type IllnessInput = z.infer<typeof illnessSchema>;

export const step2Schema = z.object({
  injuries: z.array(injurySchema).default([]),
  illnesses: z.array(illnessSchema).default([]),
});

export type Step2Input = z.infer<typeof step2Schema>;

export const reportSubmitSchema = z.object({
  step1: step1Schema,
  injuries: z.array(injurySchema).default([]),
  illnesses: z.array(illnessSchema).default([]),
});

export type ReportSubmitInput = z.infer<typeof reportSubmitSchema>;

export const reportLookupSchema = z.object({
  id: z.string().min(1, "Report ID is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ReportLookupInput = z.infer<typeof reportLookupSchema>;

export const reportUpdateSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  step1: step1Schema,
  injuries: z.array(injurySchema).default([]),
  illnesses: z.array(illnessSchema).default([]),
});

export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;

export const reportStatusSchema = z.object({
  status: z.enum(["submitted", "under_review", "resolved"]),
});

export type ReportStatusInput = z.infer<typeof reportStatusSchema>;

export const reportNoteSchema = z.object({
  message: z.string().min(1, "Note message is required"),
});

export type ReportNoteInput = z.infer<typeof reportNoteSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
