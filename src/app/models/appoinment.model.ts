import { timeModel } from "./time.model";
import { DoctorModel } from "./doctor.model";
export interface appointmentModel {
    appointmentId?: number;
    fullName: String;
    sex: number;
    phoneNumber: String;
    address: String;
    gmail: String;
    description: String;
    status?: String;
    image: String;
    dateOfBirth: String;
    createAt?: Date;
    date: Date,
    time: timeModel;
    doctor: DoctorModel;
    reviewed: boolean;
    idUser?: number;
}