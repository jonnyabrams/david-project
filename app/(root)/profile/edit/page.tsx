import { auth } from "@clerk/nextjs";

import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import ProfileForm from "@/components/forms/ProfileForm";

const EditProfile = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const dbUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <ProfileForm clerkId={userId} user={JSON.stringify(dbUser)} />
      </div>
    </>
  );
};

export default EditProfile;
