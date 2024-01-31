import { redirect } from "next/navigation";

import ProfileForm from "@/components/forms/ProfileForm";
import useCurrentUser from "@/hooks/useCurrentUser";

const Onboarding = async () => {
  const currentUser = await useCurrentUser();
  if (!currentUser) return null;

  if (currentUser.isOnboarded) redirect("/");

  return (
    <div className="max-xs:mx-10">
      <h1 className="my-4">
        Complete your profile to continue using Share Our Best...
      </h1>

      <section className="my-4">
        <ProfileForm
          clerkId={currentUser.clerkId}
          user={JSON.stringify(currentUser)}
          isOnboarding
        />
      </section>
    </div>
  );
};

export default Onboarding;
