import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ClassificationResult {
    disposalMethod: string;
    environmentalTip: string;
    timestamp: Time;
    itemType: string;
    funFact: string;
    points: bigint;
}
export interface UserProfilePublic {
    principal: Principal;
    displayName?: string;
    scanCount: bigint;
    lastScanTimestamp: Time;
    dailyChallengeProgress: bigint;
    scanHistory: Array<ClassificationResult>;
    points: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    classifyItemOffline(item: string): Promise<ClassificationResult>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<[string, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfilePublic | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfilePublic): Promise<void>;
    scanItem(item: string): Promise<ClassificationResult>;
    updateDisplayName(newName: string): Promise<void>;
}
