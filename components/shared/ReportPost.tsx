"use client";

import Image from "next/image";

import { reportPost } from "@/lib/actions/email.action";

interface ReportPostProps {
  postId: string;
  postTitle: string;
  userName: string;
  userEmail: string;
}

const ReportPost = ({
  postId,
  postTitle,
  userName,
  userEmail,
}: ReportPostProps) => {
  const handleReport = async () => {
    if (window.confirm("Are you sure you want to report this post?")) {
      await reportPost({
        postId,
        postTitle,
        userName,
        userEmail,
      });
    }
  };

  return (
    <Image
      src="/assets/icons/flag.svg"
      alt="edit"
      width={14}
      height={14}
      className="cursor-pointer object-contain"
      onClick={handleReport}
    />
  );
};

export default ReportPost;
