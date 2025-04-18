import React from "react";
import { InviteType } from "../../types/invite"; // Assuming InviteType includes seriesId details
import { StatusBadge } from "../StatusBadge";
import { DeleteInviteButton } from "./DeleteInviteButton"; // Import the delete button

// Define the props interface for the Invite component
interface InviteProps {
  invite: InviteType;
}

// The Invite component
const InviteListItem: React.FC<InviteProps> = ({ invite }) => {
  const formattedDate = new Date(invite.date).toLocaleDateString("en-US", {
    weekday: "short", // "Monday"
    year: "numeric", // "2025"
    month: "short", // "June"
    day: "numeric", // "3"
  });

  return (
    <div className="flex flex-row items-center hover:bg-blue-900">
      {" "}
      {/* Added items-center for vertical alignment */}
      {/* status */}
      <div className="p-4">
        <StatusBadge status="Sent" /> {/* Placeholder status */}
      </div>
      {/* info */}
      <div className="border-l border-l-[#7AA2F7] p-4 min-w-[10em] max-w-[20em]">
        <div>{invite.title}</div>
        <div className="text-[var(--color-turquoise)] text-xs">
          {formattedDate}
        </div>
      </div>
      {/* number accepted (Placeholder) */}
      <div className="p-4 text-sm text-[var(--color-blue)] ml-auto">6/11</div>
      {/* delete button */}
      <div className="p-4 ml-auto">
        {" "}
        {/* Added ml-auto to push button to the right */}
        <DeleteInviteButton id={invite._id} />
      </div>
    </div>
  );
};

export default InviteListItem;
