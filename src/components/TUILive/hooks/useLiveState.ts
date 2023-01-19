import { useCallback, useEffect, useState } from 'react';
import TIM, { ChatSDK, Conversation, Group } from 'tim-js-sdk';

export interface UseLiveStateParams {
  conversation?: Conversation,
  tim?: ChatSDK,
  groupID?: string,
  setActiveConversation?: (conversation?: Conversation) => void,
}

export function useLiveState<T extends UseLiveStateParams>(props:T) {
  const {
    tim,
    conversation,
    groupID,
    setActiveConversation,
  } = props;
  const [liveConversation, setLiveConversation] = useState(null);
  const [group, setGroup] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [memberList, setMemberList] = useState(null);

  const getGroupProfile = useCallback(async () => {
    if (groupID && !group) {
      const res = await tim?.getGroupProfile({ groupID });
      setGroup(res?.data?.group);
      await getOwnerProfile(res?.data?.group);
    }
  }, [tim, groupID]);

  const getOwnerProfile = async (params:Group) => {
    if (params?.ownerID) {
      const res = await tim?.getGroupMemberProfile({
        groupID,
        userIDList: [params?.ownerID],
      });
      setOwnerProfile(res?.data?.memberList[0]);
    }
  };

  const getGroupOnlineMemberCount = useCallback(async () => {
    if (groupID) {
      const imResponse = await tim?.getGroupOnlineMemberCount(groupID);
      setMemberCount(imResponse?.data?.memberCount);
      if (imResponse?.data?.memberCount > 0) {
        const membersRes = await tim?.getGroupMemberList({ groupID, offset: 0 });
        setMemberList(membersRes?.data?.memberList);
      }
    }
  }, [tim]);

  const onGroupAttributesUpdated = (event) => {
    console.log('onGroupAttributesUpdated', event?.data);
  };

  useEffect(() => {
    (async () => {
      if (liveConversation) {
        return;
      }
      if (conversation) {
        setActiveConversation(conversation);
        setLiveConversation(conversation);
      } else {
        const res = await tim?.getConversationProfile(`GROUP${groupID}`);
        setActiveConversation(res?.data?.conversation);
        setLiveConversation(res?.data?.conversation);
      }
    })();
    return () => {
      (async () => {
        if (liveConversation) {
          await tim?.deleteConversation(`GROUP${groupID}`);
          setLiveConversation(null);
          await tim?.quitGroup(groupID);
        }
      })();
    };
  }, [tim, conversation, liveConversation]);

  useEffect(() => {
    let timer = null;
    (async () => {
      await getGroupProfile();
      await getGroupOnlineMemberCount();
      timer = setInterval(async () => {
        await getGroupOnlineMemberCount();
      }, 1000 * 10);
    })();
    tim?.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
    return () => {
      tim?.off(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tim, groupID]);

  useEffect(() => {
    (async () => {
      if (liveConversation && group) {
        await tim?.joinGroup({ groupID, type: TIM.TYPES.GRP_AVCHATROOM });
      }
    })();
  }, [tim, liveConversation, group]);

  return {
    group,
    ownerProfile,
    memberCount,
    memberList,
  };
}
