import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardDataType, DataCard } from "@/components/card/Datacard";
import { PatientAppointments } from "@/components/tables/patient/PatientAppointments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Patients } from "@/components/tables/patient/Patients";
import { Provider } from "@/components/contexts/queryClient";
import { DoctorList } from "@/components/tables/doctors/DoctorList";

const DataCards: CardDataType[] = [
  {
    iconSrc: "/assets/icons/appointments.svg",
    iconAlt: "appointments",
    bgSource: "/assets/images/appointments-bg.png",
    bgAlt: "appointments",
    data: "10",
    description: "Total number of scheduled appointments",
  },
  {
    iconSrc: "/assets/icons/pending.svg",
    iconAlt: "pending",
    bgSource: "/assets/images/pending-bg.png",
    bgAlt: "pending",
    data: "10",
    description: "Total number of pending appointments",
  },
  {
    iconSrc: "/assets/icons/cancelled.svg",
    iconAlt: "cancelled",
    bgSource: "/assets/images/cancelled-bg.png",
    bgAlt: "cancelled",
    data: "10",
    description: "Total number of cancelled appointments",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col h-screen max-h-screen w-full p-4">
      <div className="flex  w-full p-4  rounded-2xl h-20 justify-between bg-dark-200 items-center">
        <Image
          src="/assets/icons/logo-full.svg"
          alt="logo"
          width={200}
          height={40}
          className="h-[80px] w-fit pt-2"
        />
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-2xl">Admin</span>
        </div>
      </div>
      <div className="flex flex-col  w-full p-4 m-2 ">
        <div className="flex flex-col gap-2 my-8">
          <h2 className="text-2xl font-bold ">Welcome, Rohit</h2>
          <p>Start creating your Appointments</p>
        </div>
        <div className="flex flex-wrap gap-8">
          {DataCards.map((card) => (
            <DataCard
              key={card.description}
              bgSource={card.bgSource}
              bgAlt={card.bgAlt}
              iconSrc={card.iconSrc}
              iconAlt={card.iconAlt}
              data={card.data}
              description={card.description}
            />
          ))}
        </div>
        <Tabs defaultValue="appointments" className="w-full my-8">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patient">Users</TabsTrigger>
            <TabsTrigger value="patient_profile">Profiles</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments">
            <Provider>
              <PatientAppointments />
            </Provider>
          </TabsContent>
          <TabsContent value="patient">
            <Provider>
              <Patients />
            </Provider>
          </TabsContent>
          <TabsContent value="patient_profile">
            Change your password here.
          </TabsContent>
          <TabsContent value="doctor">
            <Provider>
              <DoctorList />
            </Provider>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
