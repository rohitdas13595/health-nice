'use server';
import { and, count, desc, ilike, or } from "drizzle-orm";
import { db } from "../db/connection";
import { Doctor } from "../db/schema";




export const createDoctor = async ({
    name,
    specialization,
    experience,
    fees,
    address,
    avatar,
    email,
    phone,
}:{
    name: string;
    specialization?: string;
    experience: number;
    fees: number;
    address: string;
    avatar?: string;
    email: string;
    phone: string;
}) => {
    const  doctor = await db
    .insert(Doctor)
    .values({
        name,
        specialization,
        experience,
        fees,
        address,
        avatar,
        email,
        phone
    })
    .returning();
    if (doctor.length > 0 && doctor[0]) {
      return doctor[0];
    }
    return null;  

}


export const getDoctorList = async ({
    limit = 10,
    offset = 0,
    query = "",
  }: {
    limit: number;
    offset: number;
    query?: string;
  }) => {
    console.log("query.........", query);
    const doctorList = await db.query.Doctor.findMany({
      limit,
      offset,
      where: (Doctor, { eq, or }) => {
        return and(
            !!query  ?  or(
                ilike(Doctor.name, `%${query}%`),
                ilike(Doctor.email, `%${query}%`),
                ilike(Doctor.phone, `%${query}%`)
              ): undefined
        ) 
      },
      orderBy: [desc(Doctor.createdAt)],
      
    });
  
    const Numbers = await db
      .select({ count: count(Doctor.id) })
      .from(Doctor)
      .where(
        and(
            !!query  ?  or(
                ilike(Doctor.name, `%${query}%`),
                ilike(Doctor.email, `%${query}%`),
                ilike(Doctor.phone, `%${query}%`)
              ): undefined
        ) 
      );
  
    if (
      doctorList &&
      Numbers &&
      Numbers.length > 0 &&
      Numbers[0] &&
      Numbers[0].count
    ) {
      return {
        data: doctorList,
        total: Numbers[0].count,
      };
    }
    return null;
  };


  export const  getDoctorsWithoutPagination = async () => {
    const doctorList = await db.query.Doctor.findMany();
    if (doctorList) {
      return doctorList;
    }
    return null;  
  }
