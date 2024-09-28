import Image from "next/image";


export type CardDataType = {
    iconSrc: string;
    iconAlt: string;
    bgSource: string;
    bgAlt: string;
    data: string;
    description: string;
  };

export function DataCard({ iconSrc, iconAlt, data, description ,bgSource, bgAlt }: CardDataType) {
    return (
      <div
        className={
          "flex-col min-w-[400px]    w-[400px] h-auto  rounded-2xl  justify-between  stat-card  gap-8  p-8" 
        }
        style={{ backgroundImage: `url(${bgSource})` }}
      >
        <div className="flex gap-4 items-center ">
          <Image src={iconSrc} alt={iconAlt} width={40} height={40} className="h-[40px] w-[40px] flex rounded-full "/>
          <span className="text-4xl">{data}</span>
        </div>
        <p className="text-xl">{description}</p>
      </div>
    );
  }
  