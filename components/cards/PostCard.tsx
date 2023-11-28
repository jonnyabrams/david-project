"use client"

import Link from "next/link";

import { Post } from "@/types";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(post.createdAt)}
          </span>
          <Link href={`/post/${post._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {post.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <RenderTag key={tag._id} tag={tag} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={post.user.picture}
          alt="user"
          value={`${post.user.salutation} ${post.user.firstName} ${post.user.surname}`}
          title={` commented ${getTimestamp(post.createdAt)}`}
          href={`/profile/${post.user._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatLargeNumber(post.upvotes)}
          title=" votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="comments"
          value={formatLargeNumber(post.comments.length) || 0}
          title=" comments"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatLargeNumber(post.views)}
          title=" views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default PostCard;
