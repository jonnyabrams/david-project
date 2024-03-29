import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { getFullName, getJoinedDate, getUserLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import PostsTab from "@/components/shared/PostsTab";
import CommentsTab from "@/components/shared/CommentsTab";
import FollowButton from "@/components/shared/FollowButton";
import useCurrentUser from "@/hooks/useCurrentUser";

const Profile = async ({ params, searchParams }: URLProps) => {
  const currentUser = await useCurrentUser();
  // get info about user whose profile it is
  const userInfo = await getUserInfo({ userId: params.id });

  const userAlreadyFollows = userInfo.user.followers.includes(currentUser?._id);

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {getFullName(userInfo?.user)}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              {getUserLabel(userInfo?.user)}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo?.user.website && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo?.user.website}
                  title={userInfo?.user.website}
                />
              )}

              {userInfo?.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo?.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${getJoinedDate(userInfo?.user.createdAt)}`}
              />
            </div>

            {userInfo?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {currentUser?.clerkId === userInfo?.user.clerkId ? (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <FollowButton
                followingUserId={currentUser?.clerkId}
                followedUserId={params.id}
                userAlreadyFollows={userAlreadyFollows}
              />
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalPosts={userInfo?.totalPosts}
        totalComments={userInfo?.totalComments}
        totalFollowers={userInfo?.totalFollowers}
        totalFollowing={userInfo?.totalFollowing}
      />

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="comments" className="tab">
              Comments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <PostsTab
              searchProps={searchParams}
              profileUserId={userInfo?.user._id}
              currentUserClerkId={currentUser?.clerkId}
            />
          </TabsContent>
          <TabsContent value="comments" className="flex w-full flex-col gap-6">
            <CommentsTab
              searchProps={searchParams}
              profileUserId={userInfo?.user._id}
              currentUserClerkId={currentUser?.clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
