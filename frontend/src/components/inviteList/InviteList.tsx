import { InviteType } from "../../types/invite";
import InviteListItem from "./InviteListItem";

interface InviteListProps {
  invites: InviteType[];
}

const InviteList: React.FC<InviteListProps> = ({ invites }) => {
  return (
    <>
      {invites.map((invite) => (
        <InviteListItem key={invite._id} invite={invite} />
      ))}
    </>
  );
};

export default InviteList;
