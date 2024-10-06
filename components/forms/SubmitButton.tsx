import Image from "next/image";
import { Button } from "../ui/button";
import { useFormContext } from "react-hook-form";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  type: "button" | "submit" | "reset" | undefined;
}

export function SubmitButton({
  isLoading,
  className,
  children,
  type,
}: ButtonProps) {
  const context  =  useFormContext();
  console.log("context", context?.getValues());
  return (
    <Button
      type={type ?? "submit"}
      className={className ?? "shad-primary-btn"}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex  items-center justify-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
