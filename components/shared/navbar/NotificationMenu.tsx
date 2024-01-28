"use client";

import { useState, useRef, useEffect } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";

import { useTheme } from "@/context/ThemeProvider";

const NotificationMenu = ({ userId }: { userId: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const notifButtonRef = useRef(null);
  const { mode } = useTheme();

  // make sure it's executed and hydrated on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY!}
      userId={userId}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      // userToken={currentUser.knockUserToken}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!}
        colorMode={mode === "light" ? "light" : "dark"}
      >
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  ) : null;
};

export default NotificationMenu;
