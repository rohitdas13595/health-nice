import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardDataType, DataCard } from "@/components/card/Datacard";
import { PatientAppointments } from "@/components/tables/patient/PatientAppointments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Provider } from "@/components/contexts/queryClient";
import { MyProfiles } from "@/components/tables/patient/MyProfiles";
import { redirect } from "next/navigation";
import { totalNumberOfAppointments } from "@/lib/actions/appointment.action";
import { getUser } from "@/lib/actions/patient.actions";
import { getInitials } from "@/lib/utils";

export default async function Page({ params: { userId } }) {
  if (!userId) {
    redirect("/");
  }

  const user = await getUser(userId);
  if (!user) {
    redirect("/");
  }

  const totalAppointments = await totalNumberOfAppointments({
    patientId: userId,
  });

  const pendingAppointments = await totalNumberOfAppointments({
    patientId: userId,
    status: "pending",
  });

  const cancelledAppointments = await totalNumberOfAppointments({
    patientId: userId,
    status: "cancelled",
  });

  const DataCards: CardDataType[] = [
    {
      iconSrc: "/assets/icons/appointments.svg",
      iconAlt: "appointments",
      bgSource: "/assets/images/appointments-bg.png",
      bgAlt: "appointments",
      data: totalAppointments ? String(totalAppointments) : "0",
      description: "Total number of scheduled appointments",
    },
    {
      iconSrc: "/assets/icons/pending.svg",
      iconAlt: "pending",
      bgSource: "/assets/images/pending-bg.png",
      bgAlt: "pending",
      data: pendingAppointments ? String(pendingAppointments) : "0",
      description: "Total number of pending appointments",
    },
    {
      iconSrc: "/assets/icons/cancelled.svg",
      iconAlt: "cancelled",
      bgSource: "/assets/images/cancelled-bg.png",
      bgAlt: "cancelled",
      data: cancelledAppointments ? String(cancelledAppointments) : "0",
      description: "Total number of cancelled appointments",
    },
  ];

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
            <AvatarImage src={"/assets/images/avatar.png"} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="text-xl">{user.name ?? "User"}</span>
        </div>
      </div>
      <div className="flex flex-col  w-full p-4 m-2 ">
        <div className="flex flex-col gap-2 my-8">
          <h2 className="text-2xl font-bold ">{`Welcome, ${user.name ?? "User"}`}</h2>
          <p>Start creating your Appointments</p>
        </div>
        <div className="flex wrap gap-8">
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
            <TabsTrigger value="profile">Profiles</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments">
            <Provider>
              <PatientAppointments userId={userId} />
            </Provider>
          </TabsContent>
          <TabsContent value="profile">
            <Provider>
              <MyProfiles userId={userId} />
            </Provider>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
