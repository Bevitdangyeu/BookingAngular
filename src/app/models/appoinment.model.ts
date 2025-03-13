import { timeModel } from "./time.model";
import { DoctorModel } from "./doctor.model";
export interface appointmentModel {
    appoinmentId?: Number;
    fullName: String;
    sex: Number;
    phoneNumber: String;
    address: String;
    gmail: String;
    description: String;
    status?: String;
    image: String;
    dateOfBirth: String;
    createAt?: Date;
    time: timeModel;
    doctor: DoctorModel;
}