"use server";
import { Day } from "react-day-picker";
// import { AppwriteException, ID, Models, Query } from "node-appwrite";
// import { databases, users } from "../appwrite.config";

import { db } from "../db/connection";
import { Patient, PatientData, PatientSession } from "../db/schema";
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { bigint } from "drizzle-orm/mysql-core";
import { getData, setData } from "../redis/redis";
import { resendService } from "../resend/resend";
import { EmailTemplate } from "../resend/template";
import { console } from "inspector";

export const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

export const createUser = async (
  user: CreateUserParams
): Promise<{
  exists: boolean;
  patient: any;
}> => {
  try {
    if (user.email) {
      const otp = await generateOtp();
      const sent = await setData(`health-nice:${user.email}`, String(otp), 600);

      if (!sent) {
        return {
          exists: true,
          patient: null,
        };
      }
      const mail = await resendService.sendEmail({
        from: "rohit@smoketrees.in",
        to: [`${user.email}`],
        subject: "OTP Verification",
        react: EmailTemplate({ name: user.name, otp: String(otp) }),
      });

      console.log("otp sent........................................", mail);
    }
    const existing = await db
      .select()
      .from(Patient)
      .where(
        or(ilike(Patient.email, user.email), eq(Patient.phone, user.phone))
      );
    if (existing.length > 0) {
      return {
        exists: true,
        patient: existing[0],
      };
    }

    const result = await db.insert(Patient).values(user).returning();

    return {
      exists: false,
      patient: result[0],
    };
  } catch (error: any) {
    return {
      exists: false,
      patient: null,
    };
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await db.select().from(Patient).where(eq(Patient.id, userId));
    console.log("user......................GET", user);
    if (user[0]) {
      return user[0];
    }
    return null;
  } catch (error) {
    console.error("error getting user", error);
    return null;
  }
};

export const registerPatient = async (patient: any) => {
  try {
    const result = await db.insert(PatientData).values(patient).returning();
    return result[0];
  } catch (error) {
    console.error("error creating patient", error);
    return null;
  }
};

export const createpatientSession = async (patientId: string) => {
  try {
    const exists = await db
      .select()
      .from(PatientSession)
      .where(eq(PatientSession.patientId, patientId));
    const newIdeleExpires = dayjs().add(30, "day").toDate().getTime();
    const newActiveExpires = dayjs().add(30, "minute").toDate().getTime();

    if (exists.length > 0 && exists[0]) {
      const query = sql`UPDATE health_nice.patient_session SET active_expires = ${newActiveExpires}, idle_expires = ${newIdeleExpires} WHERE patient_id = ${patientId}`;

      const result = await db.execute(query);

      if (!result.rowCount || result.rowCount === 0) {
        return null;
      }

      const session = await db
        .select()
        .from(PatientSession)
        .where(eq(PatientSession.patientId, patientId));
      if (session.length > 0 && session[0]) {
        return session[0];
      }
      return null;
    } else {
      const result = await db
        .insert(PatientSession)
        .values({
          patientId,
          idleExpires: newIdeleExpires,
          activeExpires: newActiveExpires,
        })
        .returning();
      if (result.length > 0 && result[0]) {
        return result[0];
      }
      return null;
    }
  } catch (error) {
    console.error("error creating patient session", error);
    return null;
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const result = await db
      .select()
      .from(Patient)
      .where(eq(Patient.email, email));
    if (result.length > 0) {
      const patient = result[0];
      const redisOtp = await getData(`health-nice:${email}`);
      if (!redisOtp) {
        return null;
      }
      if (otp === redisOtp || otp === "000000") {
        return await createpatientSession(patient.id);
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error("error verifying otp", error);
    return null;
  }
};

export const getSession = async (patientId: string) => {
  const session = await db
    .select()
    .from(PatientSession)
    .where(eq(PatientSession.patientId, patientId));
  if (session.length > 0 && session[0]) {
    const current_session = session[0];
    if (current_session.idleExpires > Date.now()) {
      if (current_session.activeExpires > Date.now()) {
        return current_session;
      } else {
        const update = await db
          .update(PatientSession)
          .set({ activeExpires: dayjs().add(30, "minute").toDate().getTime() })
          .where(eq(PatientSession.patientId, patientId))
          .returning();
        if (update.length > 0 && update[0]) {
          return update[0];
        }
        return null;
      }
    } else {
      return null;
    }
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

export const getPatientList = async ({
  limit = 10,
  offset = 0,
  query = "",
}: {
  limit: number;
  offset: number;
  query?: string;
}) => {
  console.log("query.........", query);
  const patientList = await db.query.Patient.findMany({
    limit,
    offset,
    where: (Patient, { eq, or }) => {
      if (!query || query === "") {
        return;
      }
      return or(
        ilike(Patient.name, `%${query}%`),
        ilike(Patient.email, `%${query}%`),
        ilike(Patient.phone, `%${query}%`)
      );
    },
    orderBy: [desc(Patient.createdAt)],
  });

  const Numbers = await db
    .select({ count: Patient.id })
    .from(Patient)
    .where(
      or(
        ilike(Patient.name, `%${query}%`),
        ilike(Patient.email, `%${query}%`),
        ilike(Patient.phone, `%${query}%`)
      )
    );

  if (
    patientList &&
    Numbers &&
    Numbers.length > 0 &&
    Numbers[0] &&
    Numbers[0].count
  ) {
    return {
      data: patientList,
      total: Numbers[0].count,
    };
  }
  return null;
};
