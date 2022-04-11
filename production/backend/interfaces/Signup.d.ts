import { Document } from 'mongoose';
export interface SignupCategory {
    title: string;
    maximum?: number;
    locked?: boolean;
    users: string[];
    bannedUsers: string[];
}
export interface Signup {
    title: string;
    categories: SignupCategory[];
    location: string;
    bannedUsers: string[];
    hosts: string[];
}
export interface RootSchema extends Document {
    identifier: string;
    data?: Signup;
}
export declare const createSignup: (data: RootSchema) => Promise<boolean>;
export declare const fetchSignup: (identifier: string) => Promise<RootSchema>;
