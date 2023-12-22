/* eslint-disable no-useless-return */
"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { downvotePost, upvotePost } from "@/lib/actions/post.action";
import { formatLargeNumber } from "@/lib/utils";
import { downvoteComment, upvoteComment } from "@/lib/actions/comment.action";
import { toggleSavePost } from "@/lib/actions/user.action";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  numberOfUpvotes: number;
  userHasUpvoted: boolean;
  numberOfDownvotes: number;
  userHasDownvoted: boolean;
  userHasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  numberOfUpvotes,
  userHasUpvoted,
  numberOfDownvotes,
  userHasDownvoted,
  userHasSaved,
}: VotesProps) => {
  const pathname = usePathname();
  // const router = useRouter();

  const handleSave = async () => {
    await toggleSavePost({
      userId: JSON.parse(userId),
      postId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    if (action === "upvote") {
      if (type === "Post") {
        await upvotePost({
          postId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          userHasUpvoted,
          userHasDownvoted,
          path: pathname,
        });
      } else if (type === "Comment") {
        await upvoteComment({
          commentId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          userHasUpvoted,
          userHasDownvoted,
          path: pathname,
        });
      }

      return;
    }

    if (action === "downvote") {
      if (type === "Post") {
        await downvotePost({
          postId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          userHasUpvoted,
          userHasDownvoted,
          path: pathname,
        });
      } else if (type === "Comment") {
        await downvoteComment({
          commentId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          userHasUpvoted,
          userHasDownvoted,
          path: pathname,
        });
      }

      return;
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              userHasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(numberOfUpvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              userHasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(numberOfDownvotes)}
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

export default Votes;
