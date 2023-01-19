import React, { PropsWithChildren, useContext } from 'react';
import {
  Conversation,
  Group,
  GroupMember,
  Profile,
} from 'tim-js-sdk';

export interface LabelListItem {
  key?: string,
  value?: string,
}

export interface TUILiveActivePorps {
  type?: 'follow' | 'subscribe' | 'like' | 'unlike',
  value?: boolean,
  isShow?: boolean,
  num?: number,
}

export interface TUILiveCallbackParams {
  type?: 'follow' | 'subscribe' | 'like' | 'unlike',
  value?: boolean,
}

export interface TUILiveMemberListItemParams {
  title?: React.ReactElement | string,
  name?: string,
  filter?: (list: Array<GroupMember>, ownerProfile: GroupMember) => Array<GroupMember>,
  show?: boolean,
}

export interface TUILiveTagParam {
  type?: 'header' | 'footer',
  value?: string,
  ele?: React.MouseEvent<HTMLLIElement, MouseEvent>
}

export interface TUILiveContextValue {
  url?: string,
  conversation?: Conversation,
  group?: Group,
  ownerProfile?: GroupMember,
  myProfile?: Profile,
  follow?: TUILiveActivePorps,
  subscribe?: TUILiveActivePorps,
  like?: TUILiveActivePorps,
  unlike?: TUILiveActivePorps,
  activePlugins?: Array<React.ReactElement>,
  menuIcon?: React.ReactElement,
  callback?: (data: TUILiveCallbackParams) => void,
  memberGroupList?: Array<TUILiveMemberListItemParams>,
  memberList?: Array<GroupMember>,
  onTagClick?: (data?:TUILiveTagParam)=> void,
  memberCount?: number,
  ownerLabelList?: Array<LabelListItem>,
  liveLabelList?: Array<LabelListItem>,
}
export const TUILiveContext = React.createContext<TUILiveContextValue | undefined>(undefined);
export function TUILiveContextProvider({ children, value }:PropsWithChildren<{
    value: TUILiveContextValue
}>):React.ReactElement {
  return (
    <TUILiveContext.Provider value={(value as unknown) as TUILiveContextValue}>
      {children}
    </TUILiveContext.Provider>
  );
}
export const useTUILiveContext = (componentName?:string):TUILiveContextValue => {
  const contextValue = useContext(TUILiveContext);
  if (!contextValue && componentName) {
    return {} as TUILiveContextValue;
  }
  return (contextValue as unknown) as TUILiveContextValue;
};
