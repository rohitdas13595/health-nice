import AdminOtpModal from "@/components/forms/AdminOtp";
import { PatientForm } from "@/components/forms/PatientForm";
import { getSession, readPatientIdFromCookie } from "@/lib/actions/patient.actions";
import Image from "next/image"; 
import  {redirect} from  'next/navigation'






export default async function Home() {

  const  data  =  await readPatientIdFromCookie();

  

  if(data){

    const  session  =  await getSession(data);

   

    if(session) {
      console.log("session", session , data)
      redirect(`/patients/${data}/dashboard`);
    }
    
  }

  return (
    <div className="flex  h-screen max-h-screen w-full">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600  xl:text-left">
              &copy; 2024 Health Nice
            </p>
            <AdminOtpModal />

          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
