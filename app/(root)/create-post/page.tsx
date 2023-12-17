import PostForm from "@/components/forms/PostForm";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getUserById } from "@/lib/actions/user.action";

const CreatePost = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const dbUser = await getUserById({ userId });

  console.log("HEY", dbUser)

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
