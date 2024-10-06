"use server";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { PatientData } from "../db/schema";

export const getProfileList = async ({
  limit = 10,
  offset = 0,
  query = "",
  patientId,
}: {
  limit: number;
  offset: number;
  query?: string;
  patientId?: string;
}) => {
  console.log("query.........", query);
  const profileList = await db.query.PatientData.findMany({
    limit,
    offset,
    where: (PatientData, { eq, or }) => {
      return and(
        patientId ? eq(PatientData.patientId, patientId) : undefined,
        !!query
          ? or(
              ilike(PatientData.name, `%${query}%`),
              ilike(PatientData.email, `%${query}%`),
              ilike(PatientData.phone, `%${query}%`)
            )
          : undefined
      );
    },
    orderBy: [desc(PatientData.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(PatientData.id) })
    .from(PatientData)
    .where(
      and(
        patientId ? eq(PatientData.patientId, patientId) : undefined,
        !!query
          ? or(
              ilike(PatientData.name, `%${query}%`),
              ilike(PatientData.email, `%${query}%`),
              ilike(PatientData.phone, `%${query}%`)
            )
          : undefined
      )
    );

  if (
    profileList &&
    Numbers &&
    Numbers.length > 0 &&
    Numbers[0] &&
    Numbers[0].count
  ) {
    return {
      data: profileList,
      total: Numbers[0].count,
    };
  }
  return null;
};


export const getPatientData = async (patientId: string) => {
  const patientData = await db
    .select()
    .from(PatientData)
    .where(eq(PatientData.patientId, patientId));
  if (patientData.length > 0 && patientData[0]) {
    return patientData[0];
  }
  return null;
};