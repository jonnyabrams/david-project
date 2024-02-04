"use client";

import { Copy, Share } from "lucide-react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SharePostParams {
  postId: string;
  postTitle: string;
  currentUserName: string;
}

const SharePost = ({ postId, postTitle, currentUserName }: SharePostParams) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postId}`;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Share size={16} color="#44b891" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-dark500_light700 small-regular border-none bg-light-900 focus:outline-none active:outline-none dark:bg-dark-300">
        <DropdownMenuLabel>Share this post...</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-center gap-4">
          <EmailShareButton
            url={url}
            subject={`${currentUserName} shared a post from ${appName}`}
          >
            <EmailIcon size={24} round />
          </EmailShareButton>
          <WhatsappShareButton title={postTitle} separator=": " url={url}>
            <WhatsappIcon size={24} round />
          </WhatsappShareButton>
          <LinkedinShareButton
            title={postTitle}
            summary={`${appName}: ${postTitle}`}
            source={appName}
            url={url}
          >
            <LinkedinIcon size={24} round />
          </LinkedinShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-center gap-4">
          <FacebookShareButton url={url} title={postTitle}>
            <FacebookIcon size={24} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={postTitle}>
            <TwitterIcon size={24} round />
          </TwitterShareButton>
          <RedditShareButton url={url} title={postTitle}>
            <RedditIcon size={24} round />
          </RedditShareButton>
        </DropdownMenuItem>
        <DropdownMenuItem className="mt-4 flex cursor-pointer justify-center hover:bg-[#f6f5f5] dark:hover:bg-gray-700">
          <button onClick={handleCopyLink} className="flex items-center gap-2">
            Copy link <Copy size={14} />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SharePost;
