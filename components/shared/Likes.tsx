/* eslint-disable no-useless-return */
"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThumbsUp } from "lucide-react";

import { toggleLikePost } from "@/lib/actions/post.action";
import { formatLargeNumber } from "@/lib/utils";
import { toggleLikeComment } from "@/lib/actions/comment.action";
import { toggleSavePost } from "@/lib/actions/user.action";
import { viewPost } from "@/lib/actions/interaction.action";

interface LikesProps {
  type: string;
  itemId: string;
  userId: string;
  numberOfLikes: number;
  userHasAlreadyLiked: boolean;
  userHasSaved?: boolean;
}

const Likes = ({
  type,
  itemId,
  userId,
  numberOfLikes,
  userHasAlreadyLiked,
  userHasSaved,
}: LikesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = async () => {
    await toggleSavePost({
      userId: JSON.parse(userId),
      postId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleLike = async () => {
    if (!userId) {
      return;
    }

    if (type === "Post") {
      await toggleLikePost({
        postId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        userHasAlreadyLiked,
        path: pathname,
      });
    } else if (type === "Comment") {
      await toggleLikeComment({
        commentId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        userHasAlreadyLiked,
        path: pathname,
      });
    }
  };

  // record a view
  useEffect(() => {
    viewPost({
      postId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          {userHasAlreadyLiked ? (
            <ThumbsUp
              fill="#9898ee"
              size={20}
              onClick={handleLike}
              className="cursor-pointer text-[#000] dark:text-[#9898ee]"
            />
          ) : (
            <ThumbsUp
              size={20}
              onClick={handleLike}
              className="text-dark200_light800 cursor-pointer"
            />
          )}
          {/* <Image
            src={
              userHasAlreadyLiked
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            width={18}
            height={18}
            alt="like"
            className="cursor-pointer"
            onClick={handleLike}
          /> */}
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(numberOfLikes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Post" && (
        <Image
          src={
            userHasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Likes;
