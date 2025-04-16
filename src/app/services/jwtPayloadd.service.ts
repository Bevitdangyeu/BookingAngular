import { jwtDecode } from 'jwt-decode';
export interface jwtPayloadd {
    userName: string;
    role?: string;
    id?: number;
}