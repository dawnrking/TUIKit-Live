import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  TUIConversationList,
  TUIChat,
  TUIChatHeader,
  TUIMessageList,
  TUIMessageInput,
  TUIProfile,
  TUIConversation,
  TUIManage,
} from '@tencentcloud/chat-uikit-react';
import TIM, { ChatSDK } from 'tim-js-sdk/tim-js-friendship';

import '@tencentcloud/chat-uikit-react/dist/cjs/index.css'
import './style.scss'

import TUIChatEmpty from './TUIChatEmpty';

export default function SocialDemo(props: any) {
  const {
    className
  } = props;
  const [tim, setTim] = useState<ChatSDK>();
  useEffect(() => {
    if (props?.tim) {
      const { tim } = props;
      setTim(tim)
    }
  }, [props])

  return (
    <div className={`sample-chat ${className}`}>
      <TUIKit tim={tim}>
        <TUIConversation>
          <TUIProfile className="sample-chat-profile" />
          <TUIConversationList />
        </TUIConversation>
        <TUIChat EmptyPlaceholder={<TUIChatEmpty />}>
          <TUIChatHeader />
          <TUIMessageList />
          <TUIMessageInput />
        </TUIChat>
        <TUIManage></TUIManage>
      </TUIKit>
    </div>
  );
}
