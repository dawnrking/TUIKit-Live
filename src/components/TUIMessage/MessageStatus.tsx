import React, { PropsWithChildren } from 'react';
import { Message } from 'tim-js-sdk';
import { useTUIMessageContext } from '../../context';
import { getTimeStamp } from '../untils';

export interface MessageContextProps {
  message?: Message,
}

function MessageStatustWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const {
    isShowTime,
  } = useTUIMessageContext('MessageStatustWithContext');

  const timeElement = (typeof isShowTime === 'undefined' || isShowTime) && <div className="time">{message?.time ? getTimeStamp(message.time * 1000) : 0}</div>;

  return (
    <div className="message-status">
      {timeElement}
    </div>
  );
}

const MemoizedMessageStatus = React.memo(MessageStatustWithContext) as
typeof MessageStatustWithContext;

export function MessageStatus(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageStatus
      {...props}
    />
  );
}
