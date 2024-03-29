"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "../lib/pushers";
import { toPusherKey } from "../lib/utils";

type Props = {
  initialMessages: Message[];
  sessionId: string;
  chatPartner: User;
  chatId: string;
  sessionImage: string | null | undefined;
};

export default function Messages({
  initialMessages,
  sessionId,
  chatPartner,
  chatId,
  sessionImage,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));

    const chatMessagesHandler = (data: Message) => {
      setMessages((prev) => [data, ...prev]);
    };

    pusherClient.bind(toPusherKey(`${chatId}:messages`), chatMessagesHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));
      pusherClient.unbind(
        toPusherKey(`${chatId}:messages`),
        chatMessagesHandler,
      );
    };

    //eslint-disable-next-line
  }, []);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser = messages[index - 1]
          ? messages[index - 1].senderId === messages[index].senderId
          : false;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={clsx("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={clsx("flex flex-col space-y-2 text-base mx-2", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={clsx(
                    "relative flex items-center flex-wrap gap-x-2 px-4 py-2 rounded-lg max-w-xs lg:max-w-xl",
                    {
                      "bg-darkRed text-white": isCurrentUser,
                      "bg-gray-200 text-gray-900": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    },
                  )}
                >
                  <span className="break-words overflow-hidden">
                    {message.text}{" "}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                </span>
              </div>

              <div
                className={clsx("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    (isCurrentUser ? sessionImage : chatPartner.image) ||
                    "/Default_pfp.png"
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
