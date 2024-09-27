import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "../ui/button";

export default function AdminOtpModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="text-green-500">Admin</div>
      </DialogTrigger>
      <DialogContent className=" flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col space-y-4 mt-4">
              <p>Please enter the OTP sent to registered mobile number</p>
              <InputOTP maxLength={6} >
                <InputOTPGroup >
                  <InputOTPSlot index={0}  />
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
            </div>
            <Button className="mt-4  shad-primary-btn w-full">Enter Admin Panel</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
