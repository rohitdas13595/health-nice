"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFromField } from "./CustomFromField";
import { SubmitButton } from "./SubmitButton";
import { Phone } from "lucide-react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors, GenderTypes, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import Image from "next/image";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues:{
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
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof PatientFormValidation>) => {
      console.log("values", values);
      // setIsLoading(true);

      //   try {
      //     const result = await createUser({
      //       name: values.name,
      //       email: values.email,
      //       phone: values.phone,
      //     });
      //     if (result) {
      //       console.log("result", result);
      //       router.push(`/patients/${result.$id}/register`);
      //     }
      //   } catch (error) {
      //     console.error("error", error);
      //   }
    },
    []
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="tesxt-dark-700">Let us know more about yourself</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Personal Information</h2>

          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Name"
            placeholder="Enter you full Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <div className="flex gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="Enter Address"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone"
              placeholder="966"
            />
          </div>
          <div className="flex gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of Birth"
              placeholder="Enter Date of Birth"
              //   hint="This will be  visible on your profile"
              iconSrc="/assets/icons/calendar.svg"
              iconAlt="email"
            />
            <CustomFromField
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
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="ex: 213, Main St, GB Palya, Bengaluru"
            />
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="ex: Software Developer"
            />
          </div>
          <div className="flex  gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's Name"
            />
            <CustomFromField
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

          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="primaryPhysician"
            placeholder="Select Your Doctor"
            options={Doctors.map((doctor) => ({
              value: doctor.name,
              label: (
                <div className="flex gap-2">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={20}
                    height={20}
                  />
                  <span className="ml-2">{doctor.name}</span>
                </div>
              ),
            }))}
          />
          <div className="flex gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="Enter Insurance Provider"
            />
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ex: 1234567890"
            />
          </div>
          <div className="flex gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies ( if any )"
              placeholder="Peanuts, Sulphur , Pollen"
            />

            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current Medications"
              placeholder="diabetes, high blood pressure, Asthma"
            />
          </div>
          <div className="flex  gap-2">
            <CustomFromField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="ex: Hypertension"
            />
            <CustomFromField
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

          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification type"
            placeholder="Select Identification type"
            options={IdentificationTypes}
            defaultValue="aadharCard"
          />
          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex : 1234567890"
          />

          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.FILE_INPUT}
            name="identificationDocument"
            label="Upload Scanned Copy of Identification Document"
            placeholder="Upload Scanned Copy of Identification Document"
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Consent and Privacy</h2>

          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
            placeholder="Select Identification type"
          />
          <CustomFromField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purposes."
            placeholder="Select Identification type"
          />
          <CustomFromField
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
