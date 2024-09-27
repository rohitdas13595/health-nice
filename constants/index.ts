export const GenderOptions = ["Male", "Female", "Other"];
export enum GenderTypes {
  Male = "male",
  Female = "female",
  Other = "others",
}
export const PatientFormDefaultValues = {
    name: "",
    email: "",
    phone: "",
    birthDate: new Date(Date.now()),
    gender: GenderTypes.Male,
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    primaryPhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedication: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",
    identificationType: "aadharCard",
    identificationNumber: "",
    identificationDocument: [],
    treatmentConsent: false,
    disclosureConsent: false,
    privacyConsent: false,
}

export const IdentificationTypes = [
  {
    label: "Aadhar Card",
    value: "aadharCard",
  },
  {
    label: "Voter Id",
    value: "voterId",
  },
  {
    label: "Driving License",
    value: "drivingLicense",
  },
  {
    label: "Ration Card",
    value: "rationCard",
  },
  {
    label: "Passport",
    value: "passport",
  },
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Dr. Jivesh Shahoo",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leela Chakravarti",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Dravid Aryan",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Elvish Pal",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jagdish Pawar",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alakh Ranjan",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Janesh Kumar",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Mohan Kumar",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
