// Codes and classifications from the F-MARC 2009 "Daily Report on Injuries and Illnesses" form.

export const BODY_REGIONS = [
  {
    label: "Head & Trunk",
    parts: [
      { code: "1", label: "Face (incl. eye, ear, nose)" },
      { code: "2", label: "Head" },
      { code: "3", label: "Neck / cervical spine" },
      { code: "4", label: "Thoracic spine / upper back" },
      { code: "5", label: "Sternum / ribs" },
      { code: "6", label: "Lumbar spine / lower back" },
      { code: "7", label: "Abdomen" },
      { code: "8", label: "Pelvis / sacrum / buttock" },
    ],
  },
  {
    label: "Upper Extremity",
    parts: [
      { code: "11", label: "Shoulder / clavicle" },
      { code: "12", label: "Upper arm" },
      { code: "13", label: "Elbow" },
      { code: "14", label: "Forearm" },
      { code: "15", label: "Wrist" },
      { code: "16", label: "Hand" },
      { code: "17", label: "Finger" },
      { code: "18", label: "Thumb" },
    ],
  },
  {
    label: "Lower Extremity",
    parts: [
      { code: "21", label: "Hip" },
      { code: "22", label: "Groin" },
      { code: "23a", label: "Thigh (anterior)" },
      { code: "23p", label: "Thigh (posterior)" },
      { code: "24m", label: "Knee (medial)" },
      { code: "24l", label: "Knee (lateral)" },
      { code: "25a", label: "Lower leg (anterior)" },
      { code: "25p", label: "Lower leg (posterior)" },
      { code: "26", label: "Achilles tendon" },
      { code: "27m", label: "Ankle (medial)" },
      { code: "27l", label: "Ankle (lateral)" },
      { code: "28", label: "Foot / toe" },
    ],
  },
] as const;

export const INJURY_TYPES = [
  { code: "1", label: "Concussion" },
  { code: "2", label: "Fracture (traumatic)" },
  { code: "3", label: "Stress fracture (overuse)" },
  { code: "4", label: "Other bone injuries" },
  { code: "5", label: "Dislocation / subluxation" },
  { code: "6", label: "Tendon rupture" },
  { code: "7", label: "Ligamentous rupture" },
  { code: "8", label: "Sprain" },
  { code: "9", label: "Lesion of meniscus or cartilage" },
  { code: "10", label: "Strain / muscle rupture / tear" },
  { code: "11", label: "Contusion / haematoma / bruise" },
  { code: "12", label: "Tendinosis / tendinopathy" },
  { code: "13", label: "Arthritis / synovitis / bursitis" },
  { code: "14", label: "Fasciitis / aponeurosis injury" },
  { code: "15", label: "Impingement" },
  { code: "16", label: "Laceration / abrasion / skin lesion" },
  { code: "17", label: "Dental injury / broken tooth" },
  { code: "18", label: "Nerve injury / spinal cord injury" },
  { code: "19", label: "Muscle cramps or spasm" },
  { code: "20", label: "Other" },
] as const;

export const INJURY_CAUSES = [
  { code: "1", label: "Overuse (gradual onset)" },
  { code: "2", label: "Overuse (sudden onset)" },
  { code: "3", label: "Non-contact trauma" },
  { code: "4", label: "Recurrence of previous injury" },
  { code: "11", label: "Contact with another athlete" },
  { code: "12", label: "Contact: moving object" },
  { code: "13", label: "Contact: stagnant object" },
  { code: "14", label: "Violation of rules" },
  { code: "21", label: "Field of play conditions" },
  { code: "22", label: "Weather condition" },
  { code: "23", label: "Equipment failure" },
  { code: "24", label: "Other" },
] as const;

export const AFFECTED_SYSTEMS = [
  { code: "1", label: "Respiratory / ear, nose, throat" },
  { code: "2", label: "Gastro-intestinal" },
  { code: "3", label: "Uro-genital / gynaecological" },
  { code: "4", label: "Cardio-vascular" },
  { code: "5", label: "Allergic / immunological" },
  { code: "6", label: "Metabolic / endocrinological" },
  { code: "7", label: "Haematological" },
  { code: "8", label: "Neurological / psychiatric" },
  { code: "9", label: "Dermatologic" },
  { code: "10", label: "Musculo-skeletal" },
  { code: "11", label: "Dental" },
  { code: "12", label: "Other" },
] as const;

export const MAIN_SYMPTOMS = [
  { code: "1", label: "Fever" },
  { code: "2", label: "Pain" },
  { code: "3", label: "Diarrhoea, vomiting" },
  { code: "4", label: "Dyspnoea, cough" },
  { code: "5", label: "Palpitations" },
  { code: "6", label: "Hyper-thermia" },
  { code: "7", label: "Hypo-thermia" },
  { code: "8", label: "Dehydration" },
  { code: "9", label: "Syncope, collapse" },
  { code: "10", label: "Anaphylaxis" },
  { code: "11", label: "Lethargy, dizziness" },
  { code: "12", label: "Other" },
] as const;

export const ILLNESS_CAUSES = [
  { code: "1", label: "Pre-existing (e.g. asthma, allergy)" },
  { code: "2", label: "Infection" },
  { code: "3", label: "Exercise-induced" },
  { code: "4", label: "Environmental" },
  { code: "5", label: "Reaction to medication" },
  { code: "6", label: "Other" },
] as const;

export const ABSENCE_DAYS = [
  { code: "0", label: "0 days" },
  { code: "1", label: "1 day" },
  { code: "2", label: "2 days" },
  { code: "7", label: "1 week" },
  { code: "14", label: "2 weeks" },
  { code: "21", label: "3 weeks" },
  { code: "28", label: "4 weeks" },
  { code: ">30", label: "More than 4 weeks" },
  { code: ">180", label: "6 months or more" },
] as const;
