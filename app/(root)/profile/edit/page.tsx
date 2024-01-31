import { ParamsProps } from "@/types";
import ProfileForm from "@/components/forms/ProfileForm";
import useCurrentUser from "@/hooks/useCurrentUser";

const EditProfile = async ({ params }: ParamsProps) => {
  const currentUser = await useCurrentUser();

  if (!currentUser) return null;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <ProfileForm clerkId={currentUser.clerkId} user={JSON.stringify(currentUser)} />
      </div>
    </>
  );
};

export default EditProfile;
