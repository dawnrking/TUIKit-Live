import React, { PropsWithChildren, useMemo } from 'react';
import { Conversation, GroupMember, Profile } from 'tim-js-sdk';
import { useTUIKitContext } from '../../context';
import {
  LabelListItem,
  TUILiveActivePorps,
  TUILiveCallbackParams,
  TUILiveContextProvider,
  TUILiveContextValue,
  TUILiveMemberListItemParams,
  TUILiveTagParam,
} from '../../context/TUILiveContext';
import { useLiveState } from './hooks';

import './styles/index.scss';
import { TUILiveContent } from './TUILiveContent';
import { TUILiveFooter } from './TUILiveFooter';
import { TUILiveHeader } from './TUILiveHeader';

interface TUILiveProps {
  className?: string,
  url?: string,
  conversation?: Conversation,
  myProfile?: Profile,
  ownerProfile?: GroupMember,
  follow?: TUILiveActivePorps,
  subscribe?: TUILiveActivePorps,
  like?: TUILiveActivePorps,
  unlike?: TUILiveActivePorps,
  activePlugins?: Array<React.ReactElement>,
  menuIcon?: React.ReactElement,
  callback?: (data: TUILiveCallbackParams) => void,
  headerTag?: Array<string>,
  footerTag?: Array<string>,
  onTagClick?: (data?:TUILiveTagParam)=> void,
  groupID?: string,
  memberGroupList?: Array<TUILiveMemberListItemParams>,
  ownerLabelList?: Array<LabelListItem>,
  liveLabelList?: Array<LabelListItem>,
}

function UnMemoizedTUILive<T extends TUILiveProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    url,
    conversation: propsConversation,
    ownerProfile: propsOwnerProfile,
    myProfile: propsMyProfile,
    children,
    follow: propsFollow,
    subscribe: propsSubscribe,
    like: propsLike,
    unlike: propsUnlike,
    activePlugins = [],
    callback,
    menuIcon,
    onTagClick,
    groupID,
    memberGroupList,
    ownerLabelList,
    liveLabelList,
  } = props;

  const {
    tim,
    conversation: contextConversation,
    myProfile: contextMyProfile,
    setActiveConversation,
  } = useTUIKitContext('TUILive');

  const myProfile = propsMyProfile || contextMyProfile;

  const conversation = propsConversation || contextConversation;
  const {
    group,
    ownerProfile: contextOwnerProfile,
    memberCount,
    memberList,
  } = useLiveState({
    tim,
    conversation: propsConversation || contextConversation,
    groupID,
    setActiveConversation,
  });

  const ownerProfile = propsOwnerProfile || contextOwnerProfile;

  const follow:TUILiveActivePorps = {
    type: 'follow',
    isShow: true,
    value: false,
    num: 0,
    ...propsFollow,
  };
  const subscribe:TUILiveActivePorps = {
    type: 'subscribe',
    isShow: true,
    value: false,
    num: 0,
    ...propsSubscribe,
  };
  const like:TUILiveActivePorps = {
    type: 'like',
    isShow: true,
    value: false,
    num: 0,
    ...propsLike,
  };
  const unlike:TUILiveActivePorps = {
    type: 'unlike',
    isShow: true,
    value: false,
    num: 0,
    ...propsUnlike,
  };

  const liveContextValue: TUILiveContextValue = useMemo(
    () => ({
      url,
      group,
      conversation,
      ownerProfile,
      myProfile,
      follow,
      subscribe,
      like,
      unlike,
      activePlugins,
      menuIcon,
      callback,
      onTagClick,
      memberCount,
      memberList,
      memberGroupList,
      ownerLabelList,
      liveLabelList,
    }),
    [
      url,
      group,
      conversation,
      ownerProfile,
      myProfile,
      follow,
      subscribe,
      like,
      unlike,
      activePlugins,
      menuIcon,
      callback,
      memberGroupList,
      onTagClick,
      memberCount,
      memberList,
      ownerLabelList,
      liveLabelList,
    ],
  );

  return (
    <TUILiveContextProvider value={liveContextValue}>
      <>
        <div className={`tui-live ${className}`}>
          <TUILiveHeader />
          <TUILiveContent />
          <TUILiveFooter />
        </div>
        {
        children && children
        }
      </>
    </TUILiveContextProvider>
  );
}

export const TUILive = React.memo(UnMemoizedTUILive) as
typeof UnMemoizedTUILive;
