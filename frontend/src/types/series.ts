import { InviteType } from "./invite";

export type SeriesType = {
  id: number;
  title: string;
  description: string;
  owner: string; // Clerk User ID
  members: string[];
  invites: InviteType[];
};
