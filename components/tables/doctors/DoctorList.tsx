"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { Input } from "@/components/ui/input";
import AddDoctorForm from "@/components/forms/AddDoctor";
import { useQuery } from "@tanstack/react-query";
import { getDoctorList } from "@/lib/actions/doctor.actions";
import dayjs from "dayjs";

const  getInitials = (name: string) => {
  if(!name){
    return "NU"
  }
  const splitName = name.split(" ");
  if(splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }else if(splitName.length === 1) {
    return splitName[0][0] + "U";
  }else{
    return "NU";
  }


}

export const DoctorList = () => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [query, setQuery] = useState<string | undefined>();

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "id",
      header: "Doctor",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={row.original?.avatar ?? "https://github.com/shadcn.png"}
            />
            <AvatarFallback>{getInitials(row.original?.name)}</AvatarFallback>
          </Avatar>

          <p>{row.original?.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",

      cell: ({ row }) => {
        return <>{dayjs(row.original?.createdAt).format("MMM DD, YYYY, hh:mm A")}</>
      },

    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
  ];

  const { data: doctors, isLoading: isLoading, refetch } = useQuery({
    queryKey: ["doctors", pagination.pageIndex, pagination.pageSize, query],
    queryFn: async () =>
      await getDoctorList({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query,
      }),
    enabled: true,
    staleTime: 1000,
  });

  console.log("doctors", doctors);

  return (
    <>
      <div className="flex w-full  justify-end gap-4 my-4">
        <div>
          <Input
            placeholder="Search Doctor"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <AddDoctorForm  refetch={refetch}/>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={doctors?.data || []}
        pagination={pagination}
        setPagination={setpagination}
        rowCount={5}

      />
    </>
  );
};
