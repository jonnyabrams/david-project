import { getUserPosts } from "@/lib/actions/user.action";
import PostCard from "../cards/PostCard";
import Pagination from "./Pagination";

interface PostsTabProps {
  profileUserId: string;
  currentUserClerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

const PostsTab = async ({ searchProps, profileUserId, currentUserClerkId }: PostsTabProps) => {
  const result = await getUserPosts({
    profileUserId,
    page: searchProps?.page ? +searchProps.page : 1,
  });

  console.log(result)

  return (
    <>
      {result.posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          title={post.title}
          tags={post.tags}
          author={post.author}
          likes={post.likes}
          views={post.views}
          comments={post.comments}
          createdAt={post.createdAt}
          currentUserClerkId={currentUserClerkId}
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
