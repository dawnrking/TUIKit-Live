import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import TIM, { ChatSDK, Conversation, Group } from 'tim-js-sdk';
import { Icon, IconTypes } from '../../Icon';

interface ativeClickReturn {
  value?: boolean,
  suffixValue?: boolean,
}

interface useLiveAtiveBasicParams {
  className?: string,
  icon?: IconTypes,
  activeIcon?: IconTypes,
  iconWidth?: number,
  iconHeight?: number,
  name?: string,
  type?: string,
  value?: boolean,
  onClick?: () => ativeClickReturn;
}

export interface useLiveAtiveElementsParams extends useLiveAtiveBasicParams {
  suffix?: useLiveAtiveBasicParams;
}

export function useLiveAtiveElements<T extends useLiveAtiveElementsParams>(
  props:PropsWithChildren<T>,
) {
  const {
    name,
    type,
    icon,
    activeIcon,
    value: propsValue,
    onClick,
    className,
    suffix,
    iconWidth,
    iconHeight,
  } = props;

  const [value, setValue] = useState(propsValue);
  const [suffixValue, setSuffixValue] = useState(suffix?.value);

  const handleClick = useCallback(async () => {
    if (onClick) {
      const result = await onClick();
      setValue(result?.value);
      setSuffixValue(result.suffixValue);
    }
  }, [onClick]);
  const handleSuffixClick = useCallback(async () => {
    if (suffix?.onClick) {
      const result = await suffix?.onClick();
      setValue(result?.value);
      setSuffixValue(result.suffixValue);
    }
  }, [suffix?.onClick]);
  return (
    <li className="tui-live-item opate-item" key={name}>
      <div className="opate-box" role="menuitem" tabIndex={0} onClick={handleClick}>
        <Icon type={value ? activeIcon : icon} width={iconWidth || 15} height={iconHeight || 15} />
        <span className="list-item-text">{name}</span>
      </div>
      {
        suffix && (
        <div role="menuitem" tabIndex={0} className="opate-item-suffix line opate-box" onClick={handleSuffixClick}>
          <Icon
            type={suffixValue ? suffix.activeIcon : suffix.icon}
            width={iconWidth || 15}
            height={iconHeight || 15}
          />
        </div>
        )
      }
    </li>
  );
}
