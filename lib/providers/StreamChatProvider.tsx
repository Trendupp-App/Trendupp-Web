'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuthStore } from '@/store/authStore';
import { useStreamToken } from '@/hooks/useDisputes';

interface StreamChatContextType {
  client: StreamChat | null;
  isConnected: boolean;
  error: string | null;
}

const StreamChatContext = createContext<StreamChatContextType>({
  client: null,
  isConnected: false,
  error: null,
});

export function useStreamChat() {
  return useContext(StreamChatContext);
}

export default function StreamChatProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuthStore();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only query the stream token if we are authenticated and have user details
  const { data: tokenData, error: tokenError } = useStreamToken(!!accessToken && !!user);

  useEffect(() => {
    if (!accessToken || !user || !tokenData) {
      // Clean up connection if credentials or token data is removed
      if (chatClient) {
        chatClient.disconnectUser().then(() => {
          setChatClient(null);
          setIsConnected(false);
        });
      }
      return;
    }

    const { token, apiKey } = tokenData;
    const client = StreamChat.getInstance(apiKey);

    let isSubscribed = true;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            image: user.avatarUrl || undefined,
          },
          token,
        );
        if (isSubscribed) {
          setChatClient(client);
          setIsConnected(true);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to connect to chat server';
          setError(errorMessage);
          setIsConnected(false);
        }
      }
    };

    connect();

    return () => {
      isSubscribed = false;
      client.disconnectUser().then(() => {
        setChatClient(null);
        setIsConnected(false);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, user, tokenData]);

  // Derived error combining token fetch error and connection error
  const displayError = error || (tokenError ? 'Could not fetch GetStream credentials' : null);

  return (
    <StreamChatContext.Provider value={{ client: chatClient, isConnected, error: displayError }}>
      {children}
    </StreamChatContext.Provider>
  );
}
