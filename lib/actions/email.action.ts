"use server";

import { Resend } from "resend";

import { ReportPostEmailParams } from "./shared.types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const reportPost = async (params: ReportPostEmailParams) => {
  const { postId, postTitle, userName, userEmail } = params;

  console.log(userEmail)
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [process.env.EMAIL!.toString()],
      subject: `Reported: "${postTitle}"`,
      html: `<p>${userName}</p> has flagged the post <a href="${process.env.BASE_URL}/post/${postId}">"${postTitle}" for inappropriate content.`,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
