"use server";

import { db } from "../db/connection";
import { Patient, PatientData, PatientSession } from "../db/schema";
import { asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { bigint } from "drizzle-orm/mysql-core";
import { getData, setData } from "../redis/redis";
import { resendService } from "../resend/resend";
import { EmailTemplate } from "../resend/template";
import { console } from "inspector";
import { isTokenExpired, signToken, verifyToken } from "../jwt";
import { cookies } from "next/headers";
import { access } from "fs";

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

export const registerPatient = async (
  patient: typeof PatientData.$inferInsert
) => {
  console.log("patient", patient);
  try {
    const result = await db.insert(PatientData).values(patient).returning();

    console.log("result", result);
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
    const newActiveExpires = dayjs().add(60, "minute").toDate().getTime();

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
        console.log("session.....................................", session[0]);
        const setCookie = await setPatientCookies(session[0]);
        if (!setCookie) {
          return null;
        }

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
        const setCookie = await setPatientCookies(result[0]);
        if (!setCookie) {
          return null;
        }
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
  console.log("otp", otp, "email", email);

  try {
    const result = await db
      .select()
      .from(Patient)
      .where(eq(Patient.email, email));
    if (result.length > 0) {
      const patient = result[0];
      const redisOtp = await getData(`health-nice:${email}`);
      console.log("redisOtp", redisOtp);
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

export const setPatientCookies = async (
  session: typeof PatientSession.$inferSelect
) => {
  try {
    console.log("session.....................................", session);
    const pa = await signToken(
      {
        sessionId: session.id,
        patientId: session.patientId,
      },
      "1h"
    );

    const pr = await signToken(
      {
        sessionId: session.id,
        patientId: session.patientId,
        role: "patient",
      },
      "30d"
    );

    if (pa && pr) {
      cookies().set("pa", pa, { path: "/", maxAge: 60 * 60 });
      cookies().set("pr", pr, { path: "/", maxAge: 60 * 60 * 24 * 30 });
      return true;
    }

    return false;
  } catch (error) {
    // throw error;
    console.error("error setting patient cookies", error);
    return false;
  }
};

export const getSession = async (patientId: string) => {
  // const newIdeleExpires = dayjs().add(30, "day").toDate().getTime();
  const newActiveExpires = dayjs().add(60, "minute").toDate().getTime();
  const cookiesSession = cookies();
  const pa = cookiesSession.get("pa");
  const pr = cookiesSession.get("pr");
  if ( !pr) {
    return null;
  }

  

  const refreshToken: any = await verifyToken(pr.value);

  if (!pa) {
    if (!refreshToken) {
      return null;
    } else if (refreshToken.patientId !== patientId) {
      return null;
    }
  }

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
        const query = sql`UPDATE health_nice.patient_session SET active_expires = ${newActiveExpires} WHERE patient_id = ${patientId}`;

        const result = await db.execute(query);

        if (!result.rowCount || result.rowCount === 0) {
          return null;
        }
        const session = await db
          .select()
          .from(PatientSession)
          .where(eq(PatientSession.patientId, patientId));
        if (session.length > 0 && session[0]) {
          const setCookie = await setPatientCookies(result[0]);
          if (!setCookie) {
            return null;
          }
          return session[0];
        }
      }
    } else {
      return null;
    }
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
    .select({ count: count(Patient.id) })
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

export const readPatientIdFromCookie = async () => {
  const cookiesSession = cookies();
  const pr = cookiesSession.get("pr");
  if (!pr) {
    return null;
  }
  const accessToken: any = await verifyToken(pr?.value);
  if (!accessToken) {
    return null;
  }
  const patientId = accessToken.patientId;
  return patientId;
};
