import Image from "next/image";
import Link from "next/link";

import { getUserLabel } from "@/lib/utils";
import FollowButton from "../shared/FollowButton";
import { UserCardType } from "@/types";
import { IUser } from "@/models/user.model";

interface UserCardProps {
  user: UserCardType;
  currentUser: IUser;
}

const UserCard = async ({ user, currentUser }: UserCardProps) => {
  // const topTags = await getTopTagsForUser({ userId: user._id });

  const userAlreadyFollows = user.followers.includes(currentUser._id);

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Link
          href={`/profile/${user.clerkId}`}
          className="flex w-full flex-col items-center justify-center"
        >
          <Image
            src={user.picture}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />

          <div className="mt-4 text-center">
            <h3 className="text-dark200_light900 line-clamp-1 font-bold">
              {user.fullName}{" "}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2 line-clamp-2">
              {getUserLabel(user)}
            </p>
          </div>
        </Link>

        <div className="mt-5">
          {currentUser && (
            <FollowButton
              followingUserId={currentUser.clerkId}
              followedUserId={user.clerkId}
              userAlreadyFollows={userAlreadyFollows}
            />
          )}
        </div>

        {/* <div className="mt-5">
          {topTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {topTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div> */}
      </article>
    </div>
  );
};

export default UserCard;
