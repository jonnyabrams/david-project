import { getUserComments } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import CommentCard from "../cards/CommentCard";

interface CommentsTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const CommentsTab = async ({
  searchParams,
  userId,
  clerkId,
}: CommentsTabProps) => {
  const result = await getUserComments({
    userId,
    page: 1,
  });

  return (
    <>
      {result.comments.map((comment) => (
        <CommentCard
          key={comment._id}
          clerkId={clerkId}
          _id={comment._id}
          post={comment.post}
          author={comment.author}
          numberOfUpvotes={comment.upvotes.length}
          createdAt={comment.createdAt}
        />
      ))}
    </>
  );
};

export default CommentsTab;
