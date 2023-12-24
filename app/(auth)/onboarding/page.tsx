import { auth } from "@clerk/nextjs";

import ProfileForm from "@/components/forms/ProfileForm";
import { getUserById } from "@/lib/actions/user.action";

const Onboarding = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const dbUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="my-4">
        Complete your profile to continue using Share Our Best...
      </h1>

      <section className="my-4">
        <ProfileForm clerkId={userId} user={JSON.stringify(dbUser)} />
      </section>
    </div>
  );
};

export default Onboarding;
