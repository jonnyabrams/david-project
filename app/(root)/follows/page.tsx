import { auth } from "@clerk/nextjs";

import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getFollows, getUserById } from "@/lib/actions/user.action";
import { SearchParamsProps, UserCardType } from "@/types";
import Pagination from "@/components/shared/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Follows = async ({ searchParams }: SearchParamsProps) => {
  const { userId: clerkId } = auth();
  const currentUser = await getUserById({ userId: clerkId });

  const followersResult = await getFollows({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    userId: currentUser._id,
    type: "followers",
  });

  const followingResult = await getFollows({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    userId: currentUser._id,
    type: "following",
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/follows"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for people..."
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="followers" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="followers" className="tab">
              Followers
            </TabsTrigger>
            <TabsTrigger value="following" className="tab">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <section className="mt-12 flex flex-wrap gap-4">
              {followersResult.follows.length > 0 ? (
                followersResult.follows.map((follower: UserCardType) => (
                  <UserCard
                    key={follower._id}
                    user={follower}
                    currentUser={currentUser}
                  />
                ))
              ) : (
                <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                  <p>No users found</p>
                </div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="following" className="flex w-full flex-col gap-6">
            <section className="mt-12 flex flex-wrap gap-4">
              {followingResult.follows.length > 0 ? (
                followingResult.follows.map((follow: UserCardType) => (
                  <UserCard
                    key={follow._id}
                    user={follow}
                    currentUser={currentUser}
                  />
                ))
              ) : (
                <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                  <p>No users found</p>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={followingResult.isNext || followersResult.isNext}
        />
      </div>
    </>
  );
};

export default Follows;
