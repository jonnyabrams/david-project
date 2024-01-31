import PostForm from "@/components/forms/PostForm";
import { redirect } from "next/navigation";

import useCurrentUser from "@/hooks/useCurrentUser";

const CreatePost = async () => {
  const currentUser = await useCurrentUser();

  if (!currentUser) redirect("/sign-in");

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 ">Create a Post</h1>

      <div className="mt-9">
        <PostForm currentUserId={JSON.stringify(currentUser._id)} />
      </div>
    </div>
  );
};

export default CreatePost;
