import { getUserPosts } from "@/lib/actions/user.action";
import PostCard from "../cards/PostCard";
import Pagination from "./Pagination";

interface PostsTabProps {
  userId: string;
  clerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

const PostsTab = async ({ searchProps, userId, clerkId }: PostsTabProps) => {
  const result = await getUserPosts({
    userId,
    page: searchProps?.page ? +searchProps.page : 1,
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
          content={post.content}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchProps?.page ? +searchProps.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default PostsTab;
