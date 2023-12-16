import PostForm from "@/components/forms/PostForm";
import { redirect } from "next/navigation";

import { getUserById } from "@/lib/actions/user.action";

const CreatePost = async () => {
  // const { userId } = auth();
  const userId = "CL123"

  if (!userId) redirect("/sign-in");

  const dbUser = await getUserById({ userId });

  console.log(dbUser)
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 ">Create a Post</h1>

      <div className="mt-9">
        <PostForm dbUserId={JSON.stringify(dbUser._id)} />
      </div>
    </div>
  );
};

export default CreatePost;
