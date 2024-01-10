import Link from "next/link";

import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatLargeNumber, getTimestamp, removeHtmlTags } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

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
    fullName: string;
    specialty: string;
    trust: string;
    followers: string[];
  };
  upvotes: string[];
  views: number;
  comments: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
  content: string;
}

const PostCard = async ({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  comments,
  createdAt,
  clerkId,
  content,
}: PostCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/post/${id}`}>
            <div>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </h3>
              <p className="text-dark400_light700 mt-2 line-clamp-1 text-sm">
                {removeHtmlTags(content)}
              </p>
            </div>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Post" itemId={JSON.stringify(id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
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
          value={formatLargeNumber(upvotes.length)}
          title={` vote${upvotes.length === 1 ? "" : "s"}`}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="comments"
          value={formatLargeNumber(comments.length) || 0}
          title={comments.length === 1 ? " comment" : " comments"}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatLargeNumber(views)}
          title={views === 1 ? " view" : " views"}
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default PostCard;
