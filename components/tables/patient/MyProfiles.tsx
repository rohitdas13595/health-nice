"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../DataTable";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getProfileList } from "@/lib/actions/patient.profile.actions";
import { getInitials } from "@/lib/utils";
import { Plus } from "lucide-react";
import { da } from "date-fns/locale";
import AddAppintment from "@/components/forms/AddAppointment";

export const MyProfiles = ({ userId }: { userId?: string }) => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [query, setQuery] = useState<string | undefined>();

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "patientId",
      header: "Patient",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <p>{row.original?.name}</p>
        </div>
      ),
    },

    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "select",
      header: "Actions",

      cell: ({ row }) => (
        <AddAppintment patientProfileId={row.original?.id} patientId={row.original?.patientId}   />
      ),
    },
  ];

  const {
    data: profiles,
    isLoading: isLoadingProfiles,
    refetch,
  } = useQuery({
    queryKey: [
      "patientProfiles",
      pagination.pageIndex,
      pagination.pageSize,
      query,
    ],
    queryFn: async () =>
      await getProfileList({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query,
        patientId: userId,
      }),
    enabled: true,
    staleTime: 1000,
  });

  console.log("profiles", profiles);

  return (
    <>
      <div className="flex w-full  justify-end gap-4 my-4">
        <div>
          <Input placeholder="Search Profiles" value={query}  onChange={(e) => setQuery(e.target.value)}/>
        </div>
        <Link href={`/patients/${userId}/dashboard`}>
          <Button className="shad-primary-btn  flex gap-1">
            <Plus className="w-4 h-4 " />
            Add Profile
            </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={profiles?.data ? profiles.data : []}
        pagination={pagination}
        setPagination={setpagination}
        rowCount={profiles?.total ?? 0}
      />
    </>
  );
};
