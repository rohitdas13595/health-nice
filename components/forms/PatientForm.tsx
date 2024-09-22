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
import { signUpFormSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  RADIO="radio",
  FILE_INPUT="fileInput"
}



export function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] =useState(false);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof signUpFormSchema>) => {
   

    // setIsLoading(true);

    try {
      const  result  =  await createUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      if(result){
        console.log("result", result);
        router.push(`/patients/${result.$id}/register`);
      }

    } catch (error) {
      console.error("error", error);
    }

  }, []);

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
      </form>
    </Form>
  );
}
