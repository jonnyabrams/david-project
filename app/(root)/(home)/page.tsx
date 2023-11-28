import Link from "next/link";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResults from "@/components/shared/NoResults";
import PostCard from "@/components/cards/PostCard";

const Home = () => {
  const posts = [
    {
      _id: "1",
      title: "What on earth is a lung???",
      tags: [
        { _id: "1", name: "heart_disease", totalPosts: 4 },
        { _id: "2", name: "lung_disease", totalPosts: 12 },
      ],
      user: {_id: "2002902", salutation: "Dr.", firstName: "Bobson", surname: "Dugnutt", picture: ""},
      upvotes: 10,
      views: 1000,
      answers: 2,
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
      comments: []
    },
    {
      _id: "2",
      title: "What on earth is a heart???",
      tags: [
        { _id: "1", name: "heart_disease", totalPosts: 12 },
        { _id: "2", name: "lung_disease", totalPosts: 19 },
      ],
      user: {_id: "2002902", salutation: "Dr.", firstName: "Bobson", surname: "Dugnutt", picture: ""},
      upvotes: 20,
      views: 2130494,
      answers: 2,
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
      comments: []
    },
    {
      _id: "3",
      title: "What on earth is a face???",
      tags: [
        { _id: "1", name: "heart_disease", totalPosts: 12 },
        { _id: "2", name: "lung_disease", totalPosts: 120 },
      ],
      user: {_id: "2002902", salutation: "Dr.", firstName: "Bobson", surname: "Dugnutt", picture: ""},
      upvotes: 3000,
      views: 300010101,
      answers: 0,
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
      comments: []
    },
  ];
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
          placeholder="Search for posts..."
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
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <NoResults
            title="There aren't any posts yet!"
            description="Be the first to create one..."
            link="/create-post"
            buttonText="Create a post"
          />
        )}
      </div>
    </>
  );
};

export default Home;
