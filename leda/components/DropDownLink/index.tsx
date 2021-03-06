import React, {
  useState, useCallback,
} from 'react';
import { isEqual, isFunction, isObject } from 'lodash';
import {
  mergeClassNames, bindFunctionalRef, useTheme, useElement, useAdaptivePosition,
} from '../../utils';
import { A } from '../A';
import { DropDown } from '../DropDown';
import { Ul, UlRefCurrent } from '../Ul';
import { DropDownLinkItem } from './DropDownLinkItem';
import { COMPONENTS_NAMESPACES } from '../../constants';
import {
  ClickEvent, DropDownLinkProps, DropDownLinkRefCurrent, DropDownLinkType, TitleProps,
} from './types';
import { DataObject } from '../../commonTypes';
import { DivRefCurrent } from '../Div';

export const DropDownLink = React.forwardRef((props: DropDownLinkProps, ref?: React.Ref<DropDownLinkRefCurrent>): React.ReactElement | null => {
  const {
    data,
    itemRender,
    name,
    onChange,
    onMouseEnter,
    textField = '',
    titleRender,
    value = '',
    isOpen: isOpenProp,
    ...restProps
  } = mergeClassNames(props);

  const Title = useElement<DropDownLinkProps, {}, TitleProps>(
    'Title',
    A,
    titleRender,
    props,
  );

  const theme = useTheme(props.theme, COMPONENTS_NAMESPACES.dropDownLink);

  if (!data) return null;

  const [isOpenState, setIsOpen] = useState(false);

  const isOpen = isOpenProp ?? isOpenState;

  const containerRef = React.useRef<DivRefCurrent | null>(null);

  const classMap = React.useMemo(() => ({
    top: theme.wrapperTop,
    right: theme.wrapperRight,
    visible: theme.wrapperVisible,
  }), [theme.wrapperTop, theme.wrapperVisible, theme.wrapperRight]);

  useAdaptivePosition({ elRef: containerRef, isOpen, classNames: classMap });

  const handleClick = useCallback((ev: ClickEvent): void => {
    setIsOpen(false);
    if (isFunction(onChange)) onChange(ev);
  }, [onChange]);

  const handleMouseEnter = useCallback((ev): void => {
    setIsOpen(true);
    if (isFunction(onMouseEnter)) onMouseEnter(ev);
  }, [onMouseEnter]);

  const currentItem = (data as (DataObject | string)[]).find((item) => isEqual(item, value));

  const titleText: string | number = isObject(currentItem)
    ? currentItem[textField]
    : value as string;

  return (
    <DropDown
      onMouseEnter={handleMouseEnter}
      ref={ref && ((component) => bindFunctionalRef(component, ref, component && {
        wrapper: component.wrapper,
      }))}
      isOpen={isOpen}
      theme={{ wrapper: theme.wrapper }}
      {...restProps}
    >
      <Title className={theme.currentText}>{titleText}</Title>
      <Ul default ref={containerRef as React.Ref<UlRefCurrent>}>
        {
            (data as (DataObject | string)[]).map((item) => (
              <DropDownLinkItem
                className={theme.item}
                item={item}
                itemRender={itemRender}
                key={`${name}_${isObject(item) ? item[textField] : item}`}
                name={name}
                onClick={handleClick}
                textField={textField}
              />
            ))
          }
      </Ul>
    </DropDown>
  );
}) as DropDownLinkType;

DropDownLink.Item = DropDownLinkItem;

DropDownLink.displayName = 'DropDownLink';
