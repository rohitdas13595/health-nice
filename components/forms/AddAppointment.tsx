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
import { createAppointmentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomFormField, FormFieldType } from "./CustomFormField";
import { Form } from "../ui/form";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "./SubmitButton";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  getDoctorList,
  getDoctorsWithoutPagination,
} from "@/lib/actions/doctor.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { createAppoitment } from "@/lib/actions/appointment.action";

export default function AddAppintment({
  refetch,
  patientId,
  patientProfileId,
  doctorId,
}: {
  patientId: string;
  patientProfileId: string;
  doctorId?: string;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, unknown>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createAppointmentSchema>>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      patientId: patientId,
      patientDataId: patientProfileId,
      doctorId: "",
      time: new Date(),
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof createAppointmentSchema>) => {
      console.log("values", values);
      setIsLoading(true);

      try {
        const result = await createAppoitment({
          patientId: values.patientId,
          patientDataId: values.patientDataId,
          doctorId: values.doctorId,
          time: values.time,
          status: "pending",
        });
        if (result) {
          toast.success("Appointment added successfully");
        //   refetch();
          setOpen(false);
        } else {
          toast.error("Failed to add appointment");
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

  const { data: doctors } = useQuery({
    queryKey: ["doctors", "withoutPagination"],
    queryFn: async () => await getDoctorsWithoutPagination(),
    enabled: true,
    staleTime: 1000,
  });



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="shad-primary-btn " onClick={() => setOpen(true)}>
          Add Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-col gap-4 min-w-[min(600px,90%)]">
        <DialogHeader>
          <DialogTitle>Add Appointment</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4 mt-4 ">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    name="doctorId"
                    label="Select Doctor"
                    placeholder="Select Doctor"
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
                                    {getInitials(doctor?.name)}
                                  </AvatarFallback>
                                </Avatar>

                                <p>{doctor?.name}</p>
                              </div>
                            ),
                          }))
                        : []
                    }
                  />

                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.DATE_TIME_PICKER}
                    name="time"
                    label="Time"
                    placeholder="Enter Time"
                    iconSrc="/assets/icons/calendar.svg"
                    iconAlt="time"
                    showTimeSelect
                  />

                  <SubmitButton
                    isLoading={isLoading}
                    
                    type="submit"
                    className="mt-4  shad-primary-btn w-full"
                  >
                    Add Appointment
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
