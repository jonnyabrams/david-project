import Link from "next/link";

import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";

interface PostCardProps {
  id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId: string;
    salutation: string;
    firstName: string;
    surname: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  comments: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
}

const PostCard = ({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  comments,
  createdAt,
  clerkId,
}: PostCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/post/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <RenderTag key={tag._id} tag={tag} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="author"
          value={`${author.salutation} ${author.firstName} ${author.surname}`}
          title={` commented ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatLargeNumber(upvotes)}
          title=" votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="comments"
          value={formatLargeNumber(comments.length) || 0}
          title=" comments"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatLargeNumber(views)}
          title=" views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default PostCard;
