import { getUserPosts } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import PostCard from "../cards/PostCard";

interface PostsTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const PostsTab = async ({ searchParams, userId, clerkId }: PostsTabProps) => {
  const result = await getUserPosts({
    userId,
    page: 1,
  });

  return (
    <>
      {result.posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          title={post.title}
          tags={post.tags}
          author={post.author}
          upvotes={post.upvotes}
          views={post.views}
          comments={post.comments}
          createdAt={post.createdAt}
          clerkId={clerkId}
        />
      ))}
    </>
  );
};

export default PostsTab;
