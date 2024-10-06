"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, ControllerRenderProps } from "react-hook-form";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useState } from "react";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { TimePicker12Hours } from "../ui/datetime-picker";

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  RADIO = "radio",
  FILE_INPUT = "fileInput",
  OTP = "otp",
  DATE_TIME_PICKER = "dateTimePicker",
}

interface CustomProps {
  control: Control<any, any> | undefined;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder: string;
  hint?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFromat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  type?: string;
  options?: { label: string | React.ReactNode; value: string }[];
  defaultValue?: string;
  renderSkeleton?: (field: any) => React.ReactNode;
}

export function CustomFormField(props: CustomProps) {
  const { control, name, label, hint, fieldType } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
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

const RenderInput = ({
  field,
  props,
}: {
  field: ControllerRenderProps<any, string>;
  props: CustomProps;
}) => {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    options,
    defaultValue,
    label,
    type,
  } = props;
  switch (fieldType) {
    case FormFieldType.INPUT: {
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
            <Input
              placeholder={placeholder}
              type={type ?? "text"}
              {...field}
              className="sha-input border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:border-0"
            />
          </FormControl>
        </div>
      );
    }

    case FormFieldType.CHECKBOX: {
      return (
        <div className="flex rounded-md ">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={`data-[state=checked]:bg-green-500 data-[state=checked]:text-white`}
            />
          </FormControl>
          <FormLabel className="ml-2 text-xs">{label}</FormLabel>
        </div>
      );
    }

    case FormFieldType.TEXTAREA: {
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
            <Textarea
              placeholder={placeholder}
              {...field}
              className="sha-input border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:border-0"
            />
          </FormControl>
        </div>
      );
    }
    case FormFieldType.FILE_INPUT: {
      return (
        <div className="flex rounded-md  border  border-dark-500 border-dashed   bg-dark-400">
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
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full min-h-32 rounded-md cursor-pointer  dark:hover:bg-dark-500 "
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-green-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                  {blob && <img src={blob.url} className="w-12 h-12" alt="" />}
                </div>
                <input
                  accept="image/png, image/jpeg,image/gif"
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      console.log("file", file);
                      const newBlob = await upload(file.name, file, {
                        access: "public",
                        handleUploadUrl: "/api/blob",
                      });
                      setBlob(newBlob);
                      field.onChange(newBlob.url);
                      alert("File uploaded successfully" + newBlob.url);
                    }
                  }}
                  //  value={field.value}
                />
              </label>
            </div>
          </FormControl>
        </div>
      );
    }
    case FormFieldType.SELECT: {
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
            <Select
              onValueChange={field.onChange}
              defaultValue={field?.value ?? defaultValue}
              {...field}
              {...props}
            >
              <SelectTrigger className="w-full border-0 active:border-0 focus:border-0 focus:ring-0">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      );
    }
    case FormFieldType.PHONE_INPUT: {
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
              placeholder={placeholder}
              international
              withCountryCallingCode
              {...field}
              className=" ml-2 w-full  sha-input border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus:border-0"
            />
          </FormControl>
        </div>
      );
    }
    case FormFieldType.RADIO: {
      return (
        <div className="flex  p-2 rounded-md  border  border-dark-500  bg-dark-400">
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
            <RadioGroup
              defaultValue={field?.value ?? defaultValue}
              onValueChange={field.onChange}
              className="w-full flex"
            >
              {options?.map(
                (
                  {
                    label,
                    value,
                  }: { label: string | React.ReactNode; value: string },
                  index: number
                ) => (
                  <div key={index} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem
                      value={value}
                      id={`radio-${index}-${field.name}`}
                      className={`border-2 font-bold ${
                        (field?.value ?? defaultValue) == value
                          ? "border-green-500 text-green-500"
                          : ""
                      }`}
                    />
                    <Label htmlFor={`radio-${index}-${field.name}`}>
                      {label}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </FormControl>
        </div>
      );
    }

    case FormFieldType.DATE_PICKER: {
      return (
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex py-2 rounded-md  border  border-dark-500  bg-dark-400 gap-2">
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    alt={iconAlt ?? "icon"}
                    className="ml-2"
                    width={24}
                    height={24}
                  />
                )}
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span className="text-gray-400">Pick a date</span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </FormControl>
      );
    }

    case FormFieldType.DATE_TIME_PICKER: {
      return (
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex py-2 rounded-md  border  border-dark-500  bg-dark-400 gap-2">
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    alt={iconAlt ?? "icon"}
                    className="ml-2"
                    width={24}
                    height={24}
                  />
                )}
                {field.value ? (
                  format(field.value, "PPP hh:mm a")
                ) : (
                  <span className="text-gray-400">Pick a date</span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                // initialFocus
              />
              <div className="p-3 border-t border-border">
                <TimePicker12Hours
                  setDate={field.onChange}
                  date={field.value}
                />
              </div>
            </PopoverContent>
          </Popover>
        </FormControl>
      );
    }

    case FormFieldType.OTP: {
      return (
        <FormControl>
          <InputOTP maxLength={6} onChange={field.onChange} value={field.value}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={4} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
      );
    }
    default: {
      return null;
    }
  }
};
