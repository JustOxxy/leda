import * as React from 'react';
import { Div } from '../Div';
import {
  useTheme, bindFunctionalRef, getClassNames, mergeClassNames,
} from '../../utils';
import { VStepperItem } from './VStepperItem';
import { VStepperContext } from './VStepperContext';
import { getChildren } from './helpers';
import { COMPONENTS_NAMESPACES } from '../../constants';
import { VStepperItemProps, VStepperProps, VStepperRefCurrent } from './types';

export const VStepper = React.forwardRef((props: VStepperProps, ref?: React.Ref<VStepperRefCurrent>): React.ReactElement => {
  const {
    className, theme: themeProp, children, value, ...restProps
  } = mergeClassNames<VStepperProps>(props);

  const theme = useTheme(themeProp, COMPONENTS_NAMESPACES.vstepper);

  const isCustom = React.Children
    .toArray(children as unknown as React.ReactElement<VStepperItemProps>)
    .some((child: React.ReactElement<VStepperItemProps>): boolean => {
      const { item, typeField, type } = child.props;

      return item ? typeField && item[typeField] : type;
    });

  return (
    <Div
      ref={ref && ((component) => bindFunctionalRef(component, ref, component && {
        wrapper: component.wrapper,
      }))}
      className={getClassNames(className, theme.wrapper)}
      {...restProps}
    >
      <VStepperContext.Provider value={{ theme }}>
        {isCustom ? children : getChildren(children as unknown as React.ReactElement, value)}
      </VStepperContext.Provider>
    </Div>
  );
}) as unknown as React.FC<VStepperProps> & { Item: typeof VStepperItem };

VStepper.displayName = 'VStepper';
VStepper.Item = VStepperItem;
