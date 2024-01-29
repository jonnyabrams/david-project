import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { SignedIn, auth } from "@clerk/nextjs";
import { FileText } from "lucide-react";

import Metric from "@/components/shared/Metric";
import { getPostById } from "@/lib/actions/post.action";
import { formatLargeNumber, getTimestamp } from "@/lib/utils";
import RenderTag from "@/components/shared/RenderTag";
import CommentForm from "@/components/forms/CommentForm";
import { getUserById } from "@/lib/actions/user.action";
import Comments from "@/components/shared/Comments";
import Likes from "@/components/shared/Likes";
import EditDeleteAction from "@/components/shared/EditDeleteAction";

interface PostProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

const Post = async ({ params, searchParams }: PostProps) => {
  const result = await getPostById({ postId: params.id });

  const { userId: clerkId } = auth();

  let dbUser;

  if (clerkId) {
    dbUser = await getUserById({ userId: clerkId });
  }

  const showActionButtons = clerkId && clerkId === result?.author.clerkId;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className="flex items-center justify-start gap-1"
            href={`/profile/${result?.author.clerkId}`}
          >
            <Image
              src={result?.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {`${result?.author.salutation} ${result?.author.firstName} ${result?.author.surname}`}
            </p>
          </Link>

          <div className="flex justify-end">
            <Likes
              type="Post"
              itemId={JSON.stringify(result?._id)}
              userId={JSON.stringify(dbUser?._id)}
              numberOfLikes={result?.likes.length}
              userHasAlreadyLiked={result?.likes.includes(dbUser?._id) || false}
              userHasSaved={dbUser?.savedPosts.includes(result?._id)}
            />
          </div>
        </div>

        <span className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result?.title}
        </span>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Post" itemId={JSON.stringify(result?._id)} />
          )}
        </SignedIn>
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` posted ${getTimestamp(result?.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="comments"
          value={formatLargeNumber(result?.comments.length) || 0}
          title={result?.comments.length === 1 ? " comment" : " comments"}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatLargeNumber(result?.views)}
          title=" views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <div className="text-dark300_light900">{parse(result?.content)}</div>

      {result?.picture && (
        <Image
          src={result?.picture}
          alt="post image"
          width={340}
          height={340}
          className="mt-6 object-cover"
        />
      )}

      {result?.pdf && result?.pdf.url && (
        <a href={result?.pdf.url} target="_blank">
          <div className="mt-6 flex cursor-pointer items-center gap-2">
            <FileText className="text-dark300_light900" />
            <span className="text-dark300_light900 text-xs">
              {result?.pdf.name}
            </span>
          </div>
        </a>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {result?.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <Comments
        postId={result?._id}
        userId={dbUser?._id}
        numberOfComments={result?.comments.length}
        filter={searchParams?.filter}
        page={searchParams?.page}
      />

      <CommentForm
        postContent={result?.content}
        postId={JSON.stringify(result?._id)}
        authorId={JSON.stringify(dbUser?._id)}
      />
    </>
  );
};

export default Post;
