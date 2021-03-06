import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Div } from '../Div';
import {
  mergeClassNames, useTheme, bindFunctionalRef, getClassNames,
} from '../../utils';
import { Item, NotificationRefCurrent, NotificationsProps } from './types';
import { COMPONENTS_NAMESPACES } from '../../constants';

export const Notifications = React.forwardRef((
  props: NotificationsProps, ref?: React.Ref<NotificationRefCurrent>,
): React.ReactElement | null => {
  const {
    className,
    maxItems = 3,
    onChange,
    value,
    contentRender,
    iconRender,
    theme: themeProp,
  } = mergeClassNames(props);

  const theme = useTheme(themeProp, COMPONENTS_NAMESPACES.notifications);

  const wrapperClassNames = getClassNames(theme.wrapper, className);
  // используется для получения самого свежего value в onChange
  const valueRef = React.useRef(value);

  valueRef.current = value;

  if (!value.length) return null;

  const items = value.slice(-maxItems);

  const handleChange = (item: Item): void => {
    const currentValue = valueRef.current;

    onChange({
      component: {
        value: currentValue.filter((val) => (item.id !== val.id)),
      },
    });
  };

  return (
    <Div
      className={wrapperClassNames}
      ref={ref && ((component) => bindFunctionalRef(component, ref, component && {
        wrapper: component.wrapper || component,
      }))}
    >
      {items.map((item) => (
        <NotificationItem
          contentRender={contentRender}
          iconRender={iconRender}
          key={item.id}
          item={item}
          onChange={handleChange}
          theme={theme}
        />
      ))}
    </Div>
  );
}) as React.FC<NotificationsProps>;

Notifications.displayName = 'Notifications';
