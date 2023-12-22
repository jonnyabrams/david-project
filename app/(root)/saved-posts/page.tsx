import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import Filter from "@/components/shared/Filter";
import { PostFilters } from "@/constants/filters";
import NoResults from "@/components/shared/NoResults";
import PostCard from "@/components/cards/PostCard";
import { getSavedPosts } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const SavedPosts = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const result = await getSavedPosts({
    clerkId: userId,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Posts</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for posts..."
          otherClasses="flex-1"
        />

        <Filter
          filters={PostFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.posts.length > 0 ? (
          result.posts.map((post) => (
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
          <NoResults title="You don't have any saved posts yet!" />
        )}
      </div>
    </>
  );
};

export default SavedPosts;