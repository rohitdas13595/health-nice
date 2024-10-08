"use server";
import { and, desc, eq, gte, ilike, lte, count } from "drizzle-orm";
import { db } from "../db/connection";
import { Appointments } from "../db/schema";

export const createAppoitment = async (
  data: typeof Appointments.$inferInsert
) => {
  try {
    const result = await db.insert(Appointments).values(data).returning();
    if (result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error("error creating appointment", error);
    return null;
  }
};

export const getAppointmentList = async ({
  limit = 10,
  offset = 0,
  timeFrom,
  timeTo,
  patientId,
  status,
  doctorId,
}: {
  limit: number;
  offset: number;
  timeFrom?: Date;
  timeTo?: Date;
  patientId?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  doctorId?: string;
}) => {
  const profileList = await db.query.Appointments.findMany({
    limit,
    offset,
    where: (Appointments, { eq, or }) => {
      return and(
        patientId ? eq(Appointments.patientId, patientId) : undefined,
        timeFrom ? gte(Appointments.time, timeFrom) : undefined,
        timeTo ? lte(Appointments.time, timeTo) : undefined,
        status ? eq(Appointments.status, status) : undefined,
        doctorId ? eq(Appointments.doctorId, doctorId) : undefined
      );
    },
    orderBy: [desc(Appointments.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(Appointments.id) })
    .from(Appointments)
    .where(
      and(
        patientId ? eq(Appointments.patientId, patientId) : undefined,
        timeFrom ? gte(Appointments.time, timeFrom) : undefined,
        timeTo ? lte(Appointments.time, timeTo) : undefined,
        status ? eq(Appointments.status, status) : undefined,
        doctorId ? eq(Appointments.doctorId, doctorId) : undefined
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

export const totalNumberOfAppointments = async ({
  patientId,
  status,
}: {
  patientId?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}): Promise<number> => {
  const numbers = await db
    .select({ count: count(Appointments.id) })
    .from(Appointments)
    .where(
      and(
        patientId ? eq(Appointments.patientId, patientId) : undefined,
        status ? eq(Appointments.status, status) : undefined
      )
    );

  if (numbers && numbers[0] && numbers[0].count) {
    return numbers[0].count;
  }

  return 0;
};
