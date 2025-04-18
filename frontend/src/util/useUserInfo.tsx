import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export function useUserInfo() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    console.log(user);
    setIsAdmin(user.publicMetadata.role === "admin");
    setUserId(user.id);
  }, [user]);
  return { isAdmin, userId };
}
