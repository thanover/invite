// Define an interface for the Invite data
export type InviteType = {
  _id: string;
  title: string;
  date: string; // Or Date if you parse it
  description?: string;
  seriesId?: {
    // If populated
    _id: string;
    title: string;
  };
  // Add other fields as needed
};
