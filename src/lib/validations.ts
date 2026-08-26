import { z } from "zod";

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

export const eventSettingsSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  organizationName: z.string().min(1, "Organization name is required"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
});

export type EventSettingsInput = z.infer<typeof eventSettingsSchema>;

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  designation: z.string().min(1, "Please select your professional designation"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// --- Admin: team provisioning ---

export const teamCreateSchema = z.object({
  npc: z.string().min(1, "NPC is required"),
  name: z.string().min(1, "Team doctor name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  athletes: z
    .array(
      z.object({
        name: z.string().min(1, "Athlete name is required"),
        accreditationNo: z.string().min(1, "Accreditation number is required"),
        sport: z.string().optional(),
      }),
    )
    .optional(),
});

export type TeamCreateInput = z.infer<typeof teamCreateSchema>;

// --- Portal: athlete roster ---

export const athleteSchema = z.object({
  name: z.string().min(1, "Athlete name is required"),
  accreditationNo: z.string().min(1, "Accreditation number is required"),
  sport: z.string().optional(),
});

export type AthleteInput = z.infer<typeof athleteSchema>;

// --- Portal: daily team size ---

export const teamDaySchema = z.object({
  date: z.string().min(1, "Date is required"),
  athleteIds: z.array(z.string()).default([]),
});

export type TeamDayInput = z.infer<typeof teamDaySchema>;

export const noIncidentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  noIncidentReported: z.boolean(),
});

export type NoIncidentInput = z.infer<typeof noIncidentSchema>;

// --- Portal: injury / illness recording ---

export const injurySchema = z.object({
  athleteId: z.string().min(1, "Athlete is required"),
  sportEvent: z.string().min(1, "Sport / event is required"),
  injuryDate: z.string().min(1, "Injury date is required"),
  bodyPart: z.string().min(1, "Body part is required"),
  injuryType: z.string().min(1, "Injury type is required"),
  causeOfInjury: z.string({ error: "Cause of injury is required" }).min(1, "Cause of injury is required"),
  originalDaysLost: z.number({ error: "Days lost is required" }).min(0, "Days lost must be 0 or more"),
});

export type InjuryInput = z.infer<typeof injurySchema>;

export const injuryEditSchema = injurySchema.omit({ injuryDate: true });
export type InjuryEditInput = z.infer<typeof injuryEditSchema>;

export const illnessSchema = z.object({
  athleteId: z.string().min(1, "Athlete is required"),
  sportEvent: z.string().min(1, "Sport / event is required"),
  occurredOn: z.string().min(1, "Occurred on date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  affectedSystem: z.string({ error: "Affected system is required" }).min(1, "Affected system is required"),
  mainSymptoms: z.string({ error: "At least one symptom is required" }).min(1, "At least one symptom is required"),
  causeOfIllness: z.string({ error: "Cause of illness is required" }).min(1, "Cause of illness is required"),
  originalDaysLost: z.number({ error: "Days lost is required" }).min(0, "Days lost must be 0 or more"),
});

export type IllnessInput = z.infer<typeof illnessSchema>;

export const illnessEditSchema = illnessSchema.omit({ occurredOn: true });
export type IllnessEditInput = z.infer<typeof illnessEditSchema>;

// --- Time loss editing ---

export const timeLossSchema = z.object({
  editedDaysLost: z.coerce.number().min(0, "Days lost must be 0 or more"),
});

export type TimeLossInput = z.infer<typeof timeLossSchema>;

// --- Admin: per-record status + notes ---

export const recordStatusSchema = z.object({
  status: z.enum(["logged", "under_review", "resolved"]),
});

export type RecordStatusInput = z.infer<typeof recordStatusSchema>;

export const recordNoteSchema = z.object({
  message: z.string().min(1, "Note message is required"),
});

export type RecordNoteInput = z.infer<typeof recordNoteSchema>;
