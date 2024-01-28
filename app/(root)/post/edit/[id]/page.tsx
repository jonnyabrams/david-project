import { auth } from "@clerk/nextjs";

import PostForm from "@/components/forms/PostForm";
import { getUserById } from "@/lib/actions/user.action";
import { getPostById } from "@/lib/actions/post.action";
import { ParamsProps } from "@/types";

const EditPost = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const dbUser = await getUserById({ userId });
  const post = await getPostById({ postId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Post</h1>

      <div className="mt-9">
        <PostForm
          type="edit"
          dbUserId={JSON.stringify(dbUser._id)}
          postDetails={JSON.stringify(post)}
        />
      </div>
    </>
  );
};

export default EditPost;
