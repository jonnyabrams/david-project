import PostForm from "@/components/forms/PostForm";
import { getPostById } from "@/lib/actions/post.action";
import { ParamsProps } from "@/types";
import useCurrentUser from "@/hooks/useCurrentUser";

const EditPost = async ({ params }: ParamsProps) => {
  const currentUser = await useCurrentUser()

  if (!currentUser) return null;

  const post = await getPostById({ postId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Post</h1>

      <div className="mt-9">
        <PostForm
          type="edit"
          currentUserId={JSON.stringify(currentUser._id)}
          postDetails={JSON.stringify(post)}
        />
      </div>
    </>
  );
};

export default EditPost;
