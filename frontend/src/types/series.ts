import { InviteType } from "./invite";

export type SeriesType = {
  _id: number;
  title: string;
  description: string;
  owner: string; // Clerk User ID
  members: string[];
  invites: InviteType[];
};
