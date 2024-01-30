"use client";

import { useState, useRef } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";

interface NotificationMenuProps {
  userId: string;
  knockToken: string | undefined;
  apiKey: string;
  feedChannelId: string;
}

const NotificationMenu = ({
  userId,
  knockToken,
  apiKey,
  feedChannelId,
}: NotificationMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  return knockToken ? (
    <KnockProvider
      apiKey={apiKey}
      userId={userId}
      // In production, you must pass a signed userToken
      // and enable enhanced security mode in your Knock dashboard
      userToken={knockToken}
    >
      <KnockFeedProvider feedId={feedChannelId}>
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
