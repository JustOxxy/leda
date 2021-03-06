/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import isString from 'lodash/isString';
import { COMPONENTS_NAMESPACES } from '../../constants';
import { bindFunctionalRef, useTheme } from '../../utils';
import { useTooltipEffects } from './hooks';
import { TooltipBody } from './TooltipBody';
import {
  TooltipPosition, TooltipProps, TooltipRefCurrent,
} from './types';

export const Tooltip = React.forwardRef((props: TooltipProps, ref?: React.Ref<TooltipRefCurrent>): React.ReactElement => {
  const {
    theme: themeProp,
    isOpen,
    children,
    title,
    position: positionProp = 'top',
  } = props;

  const theme = useTheme(themeProp, COMPONENTS_NAMESPACES.tooltip);

  const invisibleElementRef = React.useRef<HTMLDivElement | null>(null);

  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = React.useState<TooltipPosition>(positionProp);

  const [isHidden, setHidden] = React.useState<boolean>(false);

  useTooltipEffects({
    invisibleElementRef,
    tooltipRef,
    isOpen,
    setPosition,
    position,
    positionProp,
    setHidden,
    children,
  });

  const shouldWrapChildren = isString(children)
    || (Array.isArray(children) && children.length > 1)
    || isHidden;

  return (
    <>
      {/* невидимый элемент, нужен для получения dom node у элемента children */}
      <div ref={invisibleElementRef} style={{ display: 'none' }} />
      {/* Если потомков больше чем 1 или передана строка, добавляем враппер */}
      {
        shouldWrapChildren
          ? (
            <div className={theme.wrapper}>
              { children }
            </div>
          )
          : children
      }
      <TooltipBody
        position={position}
        title={title}
        theme={theme}
        ref={(component) => {
          tooltipRef.current = component;

          if (ref) {
            return bindFunctionalRef(component, ref, component && {
              wrapper: component,
            });
          }
          return undefined;
        }}
      />
    </>
  );
}) as React.FC<TooltipProps>;

Tooltip.displayName = 'Tooltip';
