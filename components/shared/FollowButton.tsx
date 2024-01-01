"use client";

import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { followUser } from "@/lib/actions/user.action";

interface FollowButtonProps {
  followingUserId: string | null;
  followedUserId: string;
  userAlreadyFollows: boolean;
}

const FollowButton = ({
  followingUserId,
  followedUserId,
  userAlreadyFollows,
}: FollowButtonProps) => {
  const path = usePathname();

  const handleFollow = async () => {
    if (!followingUserId || !followedUserId) {
      return;
    }

    await followUser({
      followingUserId,
      followedUserId,
      userAlreadyFollows,
      path,
    });
  };

  return (
    <Button
      className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3"
      onClick={handleFollow}
    >
      {userAlreadyFollows ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
