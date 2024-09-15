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
import { signUpFormSchama } from "@/lib/validation";
export enum FormFeildType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}



export function PatientForm() {
  const [isLoading, setIsLoading] =useState(false);
  const form = useForm<z.infer<typeof signUpFormSchama>>({
    resolver: zodResolver(signUpFormSchama),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof signUpFormSchama>) => {
    console.log("Values  from  the  use  login  form", values);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="tesxt-dark-700">Scedule your first appointment</p>
        </section>
        <CustomFromField
          control={form.control}
          fieldType={FormFeildType.INPUT}
          name="name"
          label="Name"
          placeholder="Enter your name"
          hint="This will visisble on your profile"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFromField
          control={form.control}
          fieldType={FormFeildType.INPUT}
          name="email"
          label="Email"
          placeholder="Enter your email"
          hint="This will be used for login"
          iconSrc="/assets/icons/email.svg"
          iconAlt="Email"
        />
        <CustomFromField
          control={form.control}
          fieldType={FormFeildType.PHONE_INPUT}
          name="phone"
          label="Phone"
          placeholder="Enter your phone"
          hint="This will be used for login"
        />
        <SubmitButton type="submit" isLoading={isLoading}>
          Submit
        </SubmitButton>
      </form>
    </Form>
  );
}
