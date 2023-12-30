import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResults from "@/components/shared/NoResults";
import PostCard from "@/components/cards/PostCard";
import { getPosts } from "@/lib/actions/post.action";
import { getUserById } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import LoadMorePosts from "@/components/scroll/LoadMorePosts";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const result = await getPosts({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams?.page : 1,
  });

  const { userId } = auth();
  if (!userId) return null;

  const dbUser = await getUserById({ userId });
  if (!dbUser?.isOnboarded) redirect("/onboarding");

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Posts</h1>

        <Link href="/create-post" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Create a Post
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search posts..."
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

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
          <NoResults
            title="There aren't any posts yet!"
            description="Be the first to create one..."
            link="/create-post"
            buttonText="Create a post"
          />
        )}
      </div>

      <LoadMorePosts />
    </>
  );
};

export default Home;
