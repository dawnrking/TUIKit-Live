import React, { PropsWithChildren, useState } from 'react';
import {
  Conversation,
  Group,
  Profile,
  GroupMember,
} from 'tim-js-sdk';
import {
  LabelListItem,
  TUILiveActivePorps,
  TUILiveCallbackParams,
  useTUILiveContext,
} from '../../context/TUILiveContext';

import './styles/index.scss';

import { useLiveAtiveElements } from './hooks/useLiveAtiveElements';
import { Icon, IconTypes } from '../Icon';
import { Avatar } from '../Avatar';
import { handleNumber } from './untils';

const defaultUserAvatar = 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';

export interface TUILiveFooterBaseProps {
  className?: string,
  conversation?: Conversation,
  group?: Group,
  ownerProfile?: GroupMember,
  myProfile?: Profile,
  ownerLabelList?: Array<LabelListItem>,
}

interface TUILiveFooterProps extends TUILiveFooterBaseProps {
  TUILiveFooter?: React.ComponentType<TUILiveFooterBaseProps>,
  follow?: TUILiveActivePorps,
  subscribe?: TUILiveActivePorps,
  like?: TUILiveActivePorps,
  unlike?: TUILiveActivePorps,
  activePlugins?: Array<React.ReactElement>,
  callback?: (data: TUILiveCallbackParams) => void,
}

function UnMemoizedTUILiveFooter<T extends TUILiveFooterProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    conversation,
    group: porpsGroup,
    ownerLabelList: propsOwnerLabelList,
    ownerProfile: propsOwnerProfile,
    myProfile: propsMyProfile,
    TUILiveFooter,
    activePlugins: propsActivePlugins,
    follow: propsFollow,
    subscribe: propsSubscribe,
    like: propsLike,
    unlike: propstUnlikie,
    callback: propsCallBack,
  } = props;

  const {
    group: contextGroup,
    ownerProfile: contextOwnerProfile,
    myProfile: contextMyProfile,
    activePlugins: contextActivePlugins,
    follow: contextFollow,
    subscribe: contextSubscribe,
    like: contextLike,
    unlike: contextUnlikie,
    callback: contextCallBack,
    ownerLabelList: contextOwnerLabelList,
  } = useTUILiveContext('TUILiveHeader');

  const group = porpsGroup || contextGroup;
  const myProfile = propsMyProfile || contextMyProfile;
  const activePlugins = propsActivePlugins || contextActivePlugins;
  const follow = propsFollow || contextFollow;
  const subscribe = propsSubscribe || contextSubscribe;
  const like = propsLike || contextLike;
  const unlike = propstUnlikie || contextUnlikie;
  const callback = propsCallBack || contextCallBack;

  if (TUILiveFooter) {
    (
      <TUILiveFooter
        conversation={conversation}
        group={group}
        myProfile={myProfile}
      />
    );
  }

  const ownerLabelList = propsOwnerLabelList || contextOwnerLabelList;
  const ownerProfile = propsOwnerProfile || contextOwnerProfile;
  const ownerProfileCustomField = ownerLabelList || (ownerProfile?.memberCustomField
    || []).filter((item) => (item?.value));

  const [opateData, setOpateData] = useState({
    follow: follow.value,
    subscribe: subscribe.value,
    like: like.value,
    unlike: unlike.value,
  });

  const Follow = follow.isShow && useLiveAtiveElements({
    icon: IconTypes.UNUNION,
    activeIcon: IconTypes.UNION,
    name: 'Follow',
    type: 'follow',
    iconWidth: 12,
    iconHeight: 12,
    value: opateData.follow,
    onClick: () => {
      opateData.follow = !opateData.follow;
      callback({
        type: 'follow',
        value: opateData.follow,
      });
      return {
        value: opateData.follow,
      };
    },
  });

  const Subscribe = subscribe.isShow && useLiveAtiveElements({
    icon: IconTypes.UNVECTOR,
    activeIcon: IconTypes.VECTOR,
    name: 'Subscribe',
    type: 'subscribe',
    value: opateData.subscribe,
    onClick: () => {
      opateData.subscribe = !opateData.subscribe;
      callback({
        type: 'subscribe',
        value: opateData.subscribe,
      });
      return {
        value: opateData.subscribe,
      };
    },
  });

  const LikeOrUnlike = like.isShow && useLiveAtiveElements({
    icon: IconTypes.LIKE,
    activeIcon: IconTypes.LIKED,
    name: handleNumber(like.num, 1),
    type: 'like',
    value: !opateData.unlike ? opateData.like : false,
    suffix: unlike.isShow && {
      icon: IconTypes.UNLIKE,
      activeIcon: IconTypes.UNLIKED,
      type: 'unlike',
      value: !opateData.like ? opateData.unlike : false,
      onClick: () => {
        if (opateData.like) {
          callback({
            type: 'like',
            value: !opateData.like,
          });
        }
        opateData.like = false;
        opateData.unlike = !opateData.unlike;
        return {
          value: opateData.like,
          suffixValue: opateData.unlike,
        };
      },
    },
    onClick: () => {
      opateData.unlike = false;
      opateData.like = !opateData.like;
      callback({
        type: 'like',
        value: opateData.like,
      });
      return {
        value: opateData.like,
        suffixValue: opateData.unlike,
      };
    },
  });

  const plugins = [Follow, Subscribe, LikeOrUnlike, ...activePlugins].filter((item) => item);

  return (
    <footer className={`tui-live-footer ${className}`}>
      <Avatar size={40} image={ownerProfile?.avatar || defaultUserAvatar} />
      <div className="tui-live-footer-main">
        <div className="owner-name">
          <h1>{ownerProfile?.nick || ownerProfile?.userID}</h1>
          <Icon type={IconTypes.OWNER} width={15} height={15} />
        </div>
        <ul className="tui-live-list tag-list">
          {
            ownerProfileCustomField?.map((item) => (
              <li className="tui-live-item tag-item" key={item.value}>{item?.value}</li>
            ))
          }
        </ul>
      </div>
      <ul className="tui-live-list opate-list">
        {plugins}
      </ul>
    </footer>
  );
}

export const TUILiveFooter = React.memo(UnMemoizedTUILiveFooter) as
typeof UnMemoizedTUILiveFooter;
