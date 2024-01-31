import { getUserById } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";

const useCurrentUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) return;

  const dbUser = await getUserById({ userId: clerkUser.id });

  return dbUser;
};

export default useCurrentUser;
