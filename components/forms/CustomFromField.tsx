"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormFeildType } from "./PatientForm";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

interface CustomProps {
  control: Control<any, any> | undefined;
  fieldType: FormFeildType;
  name: string;
  label?: string;
  placeholder: string;
  hint: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFromat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  type?: string;
  renderSkeleton?: (field: any) => React.ReactNode;
}

export function CustomFromField(props: CustomProps) {
  const { control, name, label, hint, fieldType } = props;

  const RenderInput = ({
    field,
    props,
  }: {
    field: ControllerRenderProps<any, string>;
    props: CustomProps;
  }) => {
    const { fieldType, iconSrc, iconAlt, placeholder } = props;
    switch (fieldType) {
      case FormFeildType.INPUT: {
        return (
          <div className="flex rounded-md  border  border-dark-500  bg-dark-400">
            {iconSrc && (
              <Image
                src={iconSrc}
                alt={iconAlt ?? "icon"}
                className="ml-2"
                width={24}
                height={24}
              />
            )}

            <FormControl>
              <Input placeholder={placeholder} {...field} className="sha-input border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:border-0" />
            </FormControl>
          </div>
        );
      }
      case FormFeildType.PHONE_INPUT: {
        return (
          <div className="flex py-2 rounded-md  border  border-dark-500  bg-dark-400">
            {iconSrc && (
              <Image
                src={iconSrc}
                alt={iconAlt ?? "icon"}
                className="ml-2"
                width={24}
                height={24}
              />
            )}

            <FormControl>
              <PhoneInput
                defaultCountry="IN"
                {...field}
                placeholder={placeholder}
                international
                withCountryCallingCode
                {
                  ...field
                }
                className=" ml-2 w-full  sha-input border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:border-0"
              />
            </FormControl>
          </div>
        );
      }
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFeildType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderInput field={field} props={props} />
          <FormDescription>{hint}</FormDescription>
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}
