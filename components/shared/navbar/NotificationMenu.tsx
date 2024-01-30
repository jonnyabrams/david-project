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

interface NotificationMenuProps {
  userId: string;
  knockToken: string | undefined;
  apiKey: string;
  feedChannelId: string;
}

const NotificationMenu = ({ userId, knockToken, apiKey, feedChannelId }: NotificationMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const notifButtonRef = useRef(null);
  const { mode } = useTheme();

  // make sure it's executed and hydrated on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && knockToken ? (
    <KnockProvider
      apiKey={apiKey}
      userId={userId}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      userToken={knockToken}
    >
      <KnockFeedProvider
        feedId={feedChannelId}
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
