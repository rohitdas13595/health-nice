"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "./SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { GenderTypes, IdentificationTypes } from "@/constants";
import Image from "next/image";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { getDoctorsWithoutPagination } from "@/lib/actions/doctor.actions";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

export function PatientDataForm({
  userId,
  user,
}: {
  userId: string;
  user: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email,
      phone: user?.phone ?? "",
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
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof PatientFormValidation>) => {
      setIsLoading(true);
      console.log("values", values);
      try {
        const result = await registerPatient({
          primaryPhysicianId: values.primaryPhysician,
          patientId: userId,
          name: values.name,
          email: values.email,
          phone: values.phone,
          birthDate: values.birthDate.toISOString(),
          gender: values.gender as 'male' | 'female' | 'other',
          address: values.address,
          occupation: values.occupation,
          emergencyContactName: values.emergencyContactName,
          emergencyContactNumber: values.emergencyContactNumber,
          insuranceProvider: values.insuranceProvider,
          insurancePolicyNumber: values.insurancePolicyNumber,
          allergies: values.allergies,
          currentMedication: values.currentMedication,
          familyMedicalHistory: values.familyMedicalHistory,
          pastMedicalHistory: values.pastMedicalHistory,
          identificationType: values.identificationType,
          identificationNumber: values.identificationNumber,

          privacyConsent: values.privacyConsent,
          identificationDocument: values.identificationDocument,
        });
        console.log("values 1", result);
        if (result) {
          console.log("result", result);
          router.push(`/patients/${result.patientId}/dashboard`);
        }
      } catch (error) {
        console.error("error", error);
      }

      setIsLoading(false);
    },
    []
  );

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => await getDoctorsWithoutPagination(),
    enabled: true,
    staleTime: 1000,
  });

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="tesxt-dark-700">Let us know more about yourself</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Personal Information</h2>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Name"
            placeholder="Enter you full Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <div className="flex gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="Enter Address"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone"
              placeholder="966"
            />
          </div>
          <div className="flex gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of Birth"
              placeholder="Enter Date of Birth"
              //   hint="This will be  visible on your profile"
              iconSrc="/assets/icons/calendar.svg"
              iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.RADIO}
              name="gender"
              label="Gender"
              placeholder="Enter Gender"
              defaultValue={GenderTypes.Male}
              options={Object.keys(GenderTypes).map((key) => ({
                value: GenderTypes[key as keyof typeof GenderTypes],
                label: key,
              }))}
              //   hint="This will be visible on profile"
            />
          </div>
          <div className="flex  gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="ex: 213, Main St, GB Palya, Bengaluru"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="ex: Software Developer"
            />
          </div>
          <div className="flex  gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's Name"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="ex: +91 1234567890"
              //   iconAlt="emergency contact"
              //   iconSrc="/assets/icons/phone.svg"
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Medical Information</h2>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="primaryPhysician"
            placeholder="Select Your Doctor"
            options={
              doctors
                ? doctors?.map((doctor) => ({
                    value: doctor.id,
                    label: (
                      <div className="flex gap-2 items-center">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={
                              doctor?.avatar ??
                              "https://github.com/shadcn.png"
                            }
                          />
                          <AvatarFallback>
                            {getInitials(doctor?.name )}
                          </AvatarFallback>
                        </Avatar>

                        <p>{doctor?.name}</p>
                      </div>
                    ),
                  }))
                : []
            }
          />
          <div className="flex gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="Enter Insurance Provider"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ex: 1234567890"
            />
          </div>
          <div className="flex gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies ( if any )"
              placeholder="Peanuts, Sulphur , Pollen"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medications"
              placeholder="diabetes, high blood pressure, Asthma"
            />
          </div>
          <div className="flex  gap-2">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="ex: Hypertension"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family Medical History"
              placeholder="ex: Diabetes"
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Identification and Verification</h2>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification type"
            placeholder="Select Identification type"
            options={IdentificationTypes}
            defaultValue="aadharCard"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex : 1234567890"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.FILE_INPUT}
            name="identificationDocument"
            label="Upload Scanned Copy of Identification Document"
            placeholder="Upload Scanned Copy of Identification Document"
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Consent and Privacy</h2>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
            placeholder="Select Identification type"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purposes."
            placeholder="Select Identification type"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy."
            placeholder="Select Identification type"
          />
        </section>

        <SubmitButton type="submit" isLoading={isLoading}>
          Submit
        </SubmitButton>
      </form>
    </Form>
  );
}
