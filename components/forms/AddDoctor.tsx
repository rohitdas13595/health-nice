"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { addDoctorSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { Form } from "../ui/form";
import { useCallback, useState } from "react";
import { createDoctor } from "@/lib/actions/doctor.actions";
import { toast } from "sonner";
import { SubmitButton } from "./SubmitButton";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ref } from "firebase/storage";

export default function AddDoctorForm({
  refetch
}:{
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, unknown>>,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof addDoctorSchema>>({
    resolver: zodResolver(addDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      fees: "",
      address: "",
      avatar: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof addDoctorSchema>) => {
      console.log("values", values);
      setIsLoading(true);

      try {
        const result = await createDoctor({
          name: values.name,
          specialization: values.specialization,
          experience:  isNaN(Number(values.experience)) ? 0 : Number(values.experience),
          fees: isNaN(Number(values.fees)) ? 0:  Number(values.fees),
          address: values.address,
          avatar: values.avatar,
          email: values.email,
          phone: values.phone,
        });
        if (result) {
          toast.success("Doctor added successfully");
          refetch();
          setOpen(false);
        } else {
          toast.error("Doctor not added");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="shad-primary-btn "  onClick={() => setOpen(true)}  >Add Doctor</Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-col gap-4 min-w-[min(600px,90%)]">
        <DialogHeader>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4 mt-4 ">
                  <div className="flex  gap-2">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      name="name"
                      label="Name"
                      placeholder="Enter Full Name"
                      iconSrc="/assets/icons/user.svg"
                      iconAlt="user"
                    />

                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      name="email"
                      label="Email"
                      placeholder="Enter Email"
                      iconSrc="/assets/icons/email.svg"
                      iconAlt="email"
                    />
                  </div>
                  <div className="flex  gap-2">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.PHONE_INPUT}
                      name="phone"
                      label="Phone"
                      placeholder="Enter Phone"
                    />

                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      name="specialization"
                      label="Specialization"
                      placeholder="Enter Specialization"
                    />
                  </div>
                  <div className="flex  gap-2">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      type="number"
                      name="experience"
                      label="Experience"
                      placeholder="Enter Experience"
                    />

                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      type="number"
                      name="fees"
                      label="Fees"
                      placeholder="Enter Fees"
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.TEXTAREA}
                    name="address"
                    label="Address"
                    placeholder="Enter Address"
                  />

                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.FILE_INPUT}
                    name="avatar"
                    label="Avatar"
                    placeholder="Enter your Avatar"
                  />
                  <SubmitButton
                    isLoading={isLoading}
                    
                    type="submit"
                    className="mt-4  shad-primary-btn w-full"
                  >
                    Add Doctor
                  </SubmitButton>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
