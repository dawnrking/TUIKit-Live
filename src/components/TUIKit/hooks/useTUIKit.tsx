import React, { useState, useCallback, useEffect } from 'react';
import TIM, {
  ChatSDK,
  Conversation,
  Group,
  Profile,
} from 'tim-js-sdk';

export interface UseChatParams{
  tim: ChatSDK,
  activeConversation?: Conversation,
}
export const useTUIKit = ({ tim, activeConversation: paramsActiveConversation }:UseChatParams) => {
  const [conversation, setConversation] = useState<Conversation>(paramsActiveConversation);
  const [myProfile, setMyProfile] = useState<Profile>();
  const [TUIManageShow, setTUIManageShow] = useState<boolean>(false);
  const [TUIProfileShow, setTUIProfileShow] = useState<boolean>(false);
  useEffect(() => {
    const getMyProfile = async () => {
      const res = await tim?.getMyProfile();
      setMyProfile(res?.data);
    };
    getMyProfile();
  }, [tim]);
  const setActiveConversation = useCallback(
    (activeConversation?: Conversation) => {
      if (activeConversation) {
        tim?.setMessageRead({ conversationID: activeConversation.conversationID });
      }
      if (conversation && (activeConversation.conversationID !== conversation.conversationID)) {
        setTUIManageShow(false);
      }
      setConversation(activeConversation);
    },
    [tim],
  );

  useEffect(() => {
    setConversation(paramsActiveConversation);
  }, [paramsActiveConversation]);
  return {
    conversation,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
  };
};
