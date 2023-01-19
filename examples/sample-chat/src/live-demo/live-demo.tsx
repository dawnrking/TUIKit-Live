import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  TUIChat,
  TUILive,
  TUIMessageInput,
  TUIMessageList,
  TUIChatHeader,
  TUILiveMemberList,
  TUILiveMemberListItemParams,
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import  { ChatSDK } from 'tim-js-sdk/tim-js-friendship';
import { GroupMember } from 'tim-js-sdk';

import overlapping from './image/overlapping.png';
import expand from './image/expand.png';
import member from './image/member.png';
import backChat from './image/backChat.png';
import admin from './image/admin.png';
import audience from './image/audience.png';

import './style.scss'


import { LiveGift } from './live-gift';
import { LiveMessageProfix } from './live-message-profix';
import { LiveMessageName } from './live-message-name';
import { LiveNotification } from './live-notification';

export default function LiveDemo(props: any) {
  const {
    className,
  } = props;

  /**
   * @params {string} groupID  
   * @require
   * 
   * refer to @link { https://web.sdk.qcloud.com/im/doc/en/SDK.html#createGroup } createGroup - type === TIM.TYPES.GRP_AVCHATROOM
   * 
   */
  const groupID:string = '***';   

  // group for memeberList 
  const memberGroupList:Array<TUILiveMemberListItemParams> = [
    {
      title:<><img className="icon-title" src={admin} alt='' /> Administrator</> ,
      name:'Administrator',
      filter: (list: Array<GroupMember>, ownerProfile: GroupMember)=>{
        return [ownerProfile];
      },
    },
    {
      title:<><img className="icon-title" src={audience} alt='' /> Audience</> ,
      name:'Audience',
      filter: (list: Array<GroupMember>, ownerProfile: GroupMember)=>{
        return list || [];
      },
    }
  ]

  const [tim, setTim] = useState<ChatSDK>();
  const [isChatShow, setIsChatShow] = useState<boolean>(true);
  const [isMembersShow, setIsMembersShow] = useState<boolean>(false);
  const [followNum, setFollowNum] = useState<number>(12000);
  const [subscribeNum, setSubscribeNum] = useState<number>(240);
  const [likeNum, setLikeNum] = useState<number>(500);
  const [customData, setCustomData] = useState(JSON.stringify({ mode: 'live', vip: 1 }));

  useEffect(() => {
    (async ()=>{
      if (props?.tim && !tim) {
        const { tim } = props;
        setTim(tim)
      }
    })()
  });

  // open / close chat module
  const toggleChat = () => {
    setIsChatShow(!isChatShow);
    setIsMembersShow(false);
  }

  //  open / close memberList module
  const toggleMemberList = () => {
    setIsMembersShow(!isMembersShow);
  }

  // follow、subscribe、like callback
  const handleCallback = (data:any) => {
    let num = 0;
    switch (data.type) {
      case 'follow':
        num = data.value ? followNum + 1 : followNum - 1;
        setFollowNum(num)
        break;
      case 'subscribe':
        num = data.value ? subscribeNum + 1 : subscribeNum - 1;
        setSubscribeNum(num)
        break;
      case 'like':
        num = data.value ? likeNum + 1 : likeNum - 1;
        setLikeNum(num);
        break;
      default:
        break;
    }
  }

  // gift callback
  const handleTUIGift = (level:number) => {
    const data = JSON.parse(customData);
    data.vip = level;
    setCustomData(JSON.stringify(data))
  }

  return (
    <div className={`live ${className}`}>
      <TUIKit tim={tim}>
        <TUILive
          className='live-player'
          callback={handleCallback}
          follow={{
            num: followNum,
          }}
          subscribe={{
            num: subscribeNum
          }}
          like={{
            num: likeNum
          }}
          menuIcon={!isChatShow ? <img className="icon icon-expand" src={expand} alt='Expand' onClick={toggleChat} /> : <></>}
          url='https://web.sdk.qcloud.com/im/demo/intl/live-demo-video.mp4'
          groupID={groupID} 
          memberGroupList={memberGroupList}
          ownerLabelList={[{value: 'English'}, {value: 'Tencent'}]}
          liveLabelList={[{value: 'Living'}, {value: 'Tencent'}]}
        >
          <TUIChat
            className={`live-chat ${!isChatShow && 'live-none'}`}
            cloudCustomData={customData}
            messageConfig={{
              className: 'live-message',
              isShowTime: false,
              isShowRead: false,
              isShowPlugin: false,
              plugin: {
                config: {
                  quote: {
                    isShow: false,
                  },
                  forward: {
                    isShow: false,
                  },
                  revoke: {
                    isShow: false,
                  },
                  delete: {
                    isShow: false,
                  },
                  copy: {
                    isShow: false,
                  }
                }
              },
              prefix: <LiveMessageProfix />,
              customName: <LiveMessageName />,
              isShowMyAvatar: true,
            }}
            TUIMessageInputConfig={{
              className: 'live-input',
              pluginConfig: {
                isImagePicker: false,
                isVideoPicker: false,
                isFilePicker: false,
              },
              isTransmitter: true
            }}
          >
            <TUIChatHeader
              title="Live Chat"
              avatar={<img className="icon icon-overlapping" src={overlapping} alt='Overlapping' onClick={toggleChat} />}
              headerOpateIcon={<img className="icon icon-member" src={member} alt='member' onClick={toggleMemberList} />} />
            {<LiveNotification />}
            <TUIMessageList />
            <LiveGift callback={handleTUIGift} />
            <TUIMessageInput />
            {isMembersShow &&
              <div className='memeberList'>
                <header>
                  <img className="icon icon-overlapping" src={overlapping} alt='Overlapping' onClick={toggleChat} />
                  <h1>COMMUNITY</h1>
                  <img className="icon icon-backChat" src={backChat} alt='backChat' onClick={toggleMemberList} />
                </header>
                <TUILiveMemberList />
              </div>}
          </TUIChat>
        </TUILive>
    </TUIKit>
    </div>
  );
}
