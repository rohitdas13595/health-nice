"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Form } from "@/components/ui/form";
import { CustomFromField, FormFieldType } from "./CustomFromField";
import { SubmitButton } from "./SubmitButton";
import { loginFormSchema, otpFormSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export function PatientLoginForm() {
  // const router = useRouter();
  const [phone, setPhone] = useState<string | undefined>();

  if (phone) {
    return <OtpForm phone={phone} />;
  } else {
    return <PhoneForm setPhone={setPhone} />;
  }
}

function OtpForm({ phone }: { phone: string }) {
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
        if (values.otp && values.otp === "000000") {
          router.push(`/patients/userId`);
        }
      } catch (error) {
        console.error("error", error);
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
          <p className="tesxt-dark-700">Enter your OTP sent to {phone}</p>
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
          Send Otp
        </SubmitButton>
      </form>
    </Form>
  );
}

function PhoneForm({
  setPhone,
}: {
  setPhone: Dispatch<SetStateAction<string | undefined>>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const phoneForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onPhoneSubmit = useCallback(
    async (values: z.infer<typeof loginFormSchema>) => {
      setIsLoading(true);
      try {
        if (values.phone) {
          setPhone(values.phone);
        }
      } catch (error) {
        console.error("error", error);
      }

      setIsLoading(false);
    },
    []
  );

  return (
    <Form {...phoneForm}>
      <form
        onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
        className="space-y-8"
      >
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="tesxt-dark-700">Enter your phone number</p>
        </section>

        <CustomFromField
          control={phoneForm.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone"
          placeholder="Enter your phone"
          hint="Enter your Phone number"
        />
        <SubmitButton type="submit" isLoading={isLoading}>
          Login
        </SubmitButton>
      </form>
    </Form>
  );
}
