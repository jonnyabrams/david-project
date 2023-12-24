export const specialties = [
  { value: "Obstetrics", name: "Obstetrics" },
  { value: "Cardiology", name: "Cardiology" },
  { value: "Orthopedics", name: "Orthopedics" },
  { value: "Pediatrics", name: "Pediatrics" },
  { value: "Neurology", name: "Neurology" },
  { value: "Dermatology", name: "Dermatology" },
  { value: "Gastroenterology", name: "Gastroenterology" },
  { value: "Ophthalmology", name: "Ophthalmology" },
  { value: "Rheumatology", name: "Rheumatology" },
  { value: "Urology", name: "Urology" },
  { value: "Hematology", name: "Hematology" },
  { value: "Endocrinology", name: "Endocrinology" },
  { value: "Nephrology", name: "Nephrology" },
  { value: "Pulmonology", name: "Pulmonology" },
  { value: "Oncology", name: "Oncology" },
  { value: "Psychiatry", name: "Psychiatry" },
  { value: "Radiology", name: "Radiology" },
  { value: "Gynecology", name: "Gynecology" },
  { value: "Emergency Medicine", name: "Emergency Medicine" },
  { value: "Geriatrics", name: "Geriatrics" },
];

export const specialtiesWithSubspecialties = ["Cardiology", "Neurology"];

export const cardiologySubspecialties = [
  { value: "Subspecialty A", name: "Subspecialty A" },
  { value: "Subspecialty B", name: "Subspecialty B" },
  { value: "Subspecialty C", name: "Subspecialty C" },
  { value: "Subspecialty D", name: "Subspecialty D" },
];

export const neurologySubspecialties = [
  { value: "Subspecialty E", name: "Subspecialty E" },
  { value: "Subspecialty F", name: "Subspecialty F" },
  { value: "Subspecialty G", name: "Subspecialty G" },
  { value: "Subspecialty H", name: "Subspecialty H" },
];

export const subspecialtyMatcher = {
  "Cardiology": cardiologySubspecialties,
  "Neurology": neurologySubspecialties
}
