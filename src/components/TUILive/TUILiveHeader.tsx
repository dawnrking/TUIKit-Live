import React, { PropsWithChildren } from 'react';
import { Conversation, Group } from 'tim-js-sdk';
import {
  LabelListItem,
  TUILiveActivePorps,
  TUILiveTagParam,
  useTUILiveContext,
} from '../../context/TUILiveContext';

import './styles/index.scss';

import { Icon, IconTypes } from '../Icon';
import { handleNumber } from './untils';

export interface TUILiveHeaderBaseProps {
  className?: string,
  conversation?: Conversation,
  group?: Group,
  liveLabelList?: Array<LabelListItem>,
}

interface TUILiveHeaderProps extends TUILiveHeaderBaseProps {
  TUILiveHeader?: React.ComponentType<TUILiveHeaderBaseProps>,
  menuIcon?: React.ReactElement,
  follow?: TUILiveActivePorps,
  subscribe?: TUILiveActivePorps,
  onTagClick?: (data?:TUILiveTagParam)=> void,
}

function UnMemoizedTUILiveHeader<T extends TUILiveHeaderProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    conversation,
    group: porpsGroup,
    TUILiveHeader,
    menuIcon: propsMenuIcon,
    follow: propsFollow,
    subscribe: propsSubscribe,
    onTagClick: propsOnTagClick,
    liveLabelList: propsLiveLabelList,
  } = props;

  const {
    group: contextGroup,
    follow: contextFollow,
    subscribe: contextSubscribe,
    menuIcon: contextMenuIcon,
    onTagClick: contextOnTagClick,
    memberCount,
    liveLabelList: contextLiveLabelList,
  } = useTUILiveContext('TUILiveHeader');

  const group = porpsGroup || contextGroup;
  const menuIcon = propsMenuIcon || contextMenuIcon;
  const follow = propsFollow || contextFollow;
  const subscribe = propsSubscribe || contextSubscribe;
  const onTagClick = propsOnTagClick || contextOnTagClick;

  if (TUILiveHeader) (<TUILiveHeader conversation={conversation} group={group} />);

  const groupCustomField = propsLiveLabelList
  || contextLiveLabelList
  || (group?.groupCustomField || []).filter((item) => (item?.value));

  const contentList = [
    {
      icon: IconTypes.MEMBER,
      value: memberCount || 0,
    },
    {
      icon: IconTypes.UNION,
      value: follow.num || 0,
    },
    {
      icon: IconTypes.VECTOR,
      value: subscribe.num || 0,
    },
  ];

  return (
    <header className={`tui-live-header ${className}`}>
      <div className="tui-live-header-name">
        <h1>{group?.name || group?.groupID}</h1>
        {menuIcon}
      </div>
      <div className="tui-live-header-content">
        <ul className="tui-live-list tag-list">
          {
            groupCustomField?.map((item, index) => (
              <li
                role="menuitem"
                tabIndex={index}
                className={index === 0 ? 'tui-live-header-label' : 'tui-live-item tag-item'}
                key={item.value}
                onClick={(e) => { onTagClick({ value: item.value, ele: e }); }}
              >
                {index === 0 && <Icon className="icon" type={IconTypes.LIVING} width={12} height={12} />}
                {item?.value}
              </li>
            ))
          }
        </ul>
        <ul className="tui-live-list">
          {
            contentList?.map((item) => (
              <li className="tui-live-item" key={item.icon}>
                <Icon className="icon" type={item.icon} width={12} height={12} />
                <span className="list-item-text">{handleNumber(item.value)}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </header>
  );
}

export const TUILiveHeader = React.memo(UnMemoizedTUILiveHeader) as
typeof UnMemoizedTUILiveHeader;
