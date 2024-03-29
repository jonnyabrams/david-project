import Link from "next/link";
import { redirect } from "next/navigation";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResults from "@/components/shared/NoResults";
import PostCard from "@/components/cards/PostCard";
import { getPosts } from "@/lib/actions/post.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import GlobalSearch from "@/components/shared/search/GlobalSearch";
import { getPopularTags } from "@/lib/actions/tag.action";
import RenderTag from "@/components/shared/RenderTag";
import Intro from "@/components/home/Intro";
import useCurrentUser from "@/hooks/useCurrentUser";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const result = await getPosts({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  const popularTags = await getPopularTags();

  const currentUser = await useCurrentUser();

  if (!currentUser) return <Intro />;

  if (currentUser && !currentUser?.isOnboarded) redirect("/onboarding");

  return (
    <>
      <div className="mb-20">
        <div className="flex flex-col gap-4">
          <p className="text-dark300_light700 h3-bold">
            Find posts, users and tags...
          </p>
          <GlobalSearch />
          <div className="flex items-center gap-3">
            <p className="text-dark300_light700 text-xs">Trending tags:</p>
            {popularTags.slice(0, 3).map((tag: any) => (
              <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex w-full items-center justify-between gap-4 sm:flex-row">
          <h1 className="h1-bold max-sm:h2-bold text-dark100_light900 w-40">
            All Posts
          </h1>

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
                likes={post.likes}
                views={post.views}
                comments={post.comments}
                createdAt={post.createdAt}
                currentUserClerkId={post.clerkId}
                content={post.content}
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

        <div className="mt-10">
          <Pagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={result.isNext}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
