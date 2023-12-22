import PostCard from "@/components/cards/PostCard";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getPostsByTagId } from "@/lib/actions/tag.action";
import { IPost } from "@/models/post.model";
import { URLProps } from "@/types";

const PostsByTag = async ({ params, searchParams }: URLProps) => {
  const result = await getPostsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Posts about {result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag..."
          otherClasses="flex-1"
        />

      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.posts.length > 0 ? (
          result.posts.map((post: IPost) => (
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
              clerkId={post.clerkId}
            />
          ))
        ) : (
          <NoResults title="Nothing here yet!" />
        )}
      </div>
    </>
  );
};

export default PostsByTag;
