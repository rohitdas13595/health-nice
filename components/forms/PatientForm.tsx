"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Form } from "@/components/ui/form";
import { CustomFromField, FormFieldType } from "./CustomFromField";
import { SubmitButton } from "./SubmitButton";
import { otpFormSchema, signUpFormSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, verifyOtp } from "@/lib/actions/patient.actions";
import Link from "next/link";
import { set } from "date-fns";
import { toast } from "sonner";

export function PatientForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | undefined>();

  return (
    <div>
      {open ? (
        <OtpForm email={email ?? ""} />
      ) : (
        <PatientRegisterForm setOpen={setOpen} setEmail={setEmail} />
      )}
    </div>
  );
}

function OtpForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onOtpSubmit = useCallback(
    async (values: z.infer<typeof otpFormSchema>) => {
      setIsLoading(true);
      try {
        const verified = await verifyOtp(values.otp, email);
        if (verified) {
          router.push(`/patients/${verified.patientId}/dashboard`);
          return;
        } else {
          toast.error("Invalid OTP");
        }
      } catch (error) {
        console.error("error", error);

        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
      setIsLoading(false);
    },
    []
  );

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="tesxt-dark-700">Enter your OTP sent to {email}</p>
        </section>

        <CustomFromField
          control={otpForm.control}
          fieldType={FormFieldType.OTP}
          name="otp"
          label="OTP"
          placeholder="Enter your OTP"
          hint="Enter your 6 digit OTP"
        />
        <SubmitButton type="submit" isLoading={isLoading}>
          Verify Otp
        </SubmitButton>
      </form>
    </Form>
  );
}

export function PatientRegisterForm({
  setOpen,
  setEmail,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string | undefined>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof signUpFormSchema>) => {
      setIsLoading(true);

      try {
        const result = await createUser({
          name: values.name,
          email: values.email,
          phone: values.phone,
        });
        if (result.exists) {
          setOpen(true);
          setEmail(result.patient.email);
        }
      } catch (error) {
        console.error("error", error);
      }

      setIsLoading(false);
    },
    []
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="tesxt-dark-700">Schedule your first appointment</p>
        </section>
        <CustomFromField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Name"
          placeholder="Enter your name"
          hint="This will visisble on your profile"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFromField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="Enter your email"
          hint="This will be used for login"
          iconSrc="/assets/icons/email.svg"
          iconAlt="Email"
        />
        <CustomFromField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone"
          placeholder="Enter your phone"
          hint="This will be used for login"
        />
        <SubmitButton type="submit" isLoading={isLoading}>
          Submit
        </SubmitButton>

        <div>
          Already have an account?
          <Link href="/patients/login" className="text-green-500">
            {" "}
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
