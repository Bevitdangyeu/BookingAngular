import { userModel } from "./user.model";
export interface DoctorModel {
    idDoctor: number;
    certificate: string;
    expertise: string;
    experience: number;
    hospital: string;
    star: number;
    description: string;
    phoneNumber: string;
    shortDescription: string;
    userDTO: userModel;
}