import React from 'react';
import isNil from 'lodash/isNil';
import { COMPONENTS_NAMESPACES } from '../../constants';
import { createSelectHandler } from './handlers';
import { useCustomElements } from './hooks';
import { TabContent } from './TabContent';
import { Tab } from './Tab';
import {
  bindFunctionalRef, getClassNames, mergeClassNames, useTheme,
} from '../../utils';
import { TabsContext } from './TabsContext';
import { TabsProps, TabsRefCurrent } from './types';

export const Tabs = React.forwardRef((props: TabsProps, ref?: React.Ref<TabsRefCurrent>): React.ReactElement | null => {
  const {
    theme: themeProp,
    activeTabKey: activeTabKeyProp,
    children,
    className,
    style,
    tabRender,
  } = mergeClassNames<TabsProps>(props);

  const theme = useTheme(themeProp, COMPONENTS_NAMESPACES.tabs);

  const [activeTabKeyState, setActiveTabKeyState] = React.useState<string | number>(0);

  // если не передано activeTabKey - работать в неконтролируемом режиме
  const activeTabKey = isNil(activeTabKeyProp)
    ? activeTabKeyState
    : activeTabKeyProp;

  const handleSelect = createSelectHandler(props, activeTabKeyState, setActiveTabKeyState);

  const tabsContext = {
    activeTabKey, onTabSelect: handleSelect, theme, tabRender,
  };

  const combinedClassNames = getClassNames(theme.wrapper, className);

  const {
    Wrapper,
    Content,
    Heading,
  } = useCustomElements(props, { activeTabKey: activeTabKeyState });

  if (!children) return null;

  return (
    <Wrapper
      className={combinedClassNames}
      style={style as React.CSSProperties}
      ref={ref && ((component) => bindFunctionalRef(component, ref, component && {
        wrapper: component.wrapper,
        content: component.wrapper && component.wrapper.querySelector(`.${theme.content}`),
      }))}
    >
      <Heading className={theme.tabsBar}>
        <TabsContext.Provider value={tabsContext}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            return (
              <Tab {...child.props} />
            );
          })}
        </TabsContext.Provider>
      </Heading>
      <Content className={theme.content}>
        <TabContent activeTabKey={activeTabKey} key={activeTabKey}>
          {children}
        </TabContent>
      </Content>
    </Wrapper>
  );
}) as React.FC<TabsProps>;

Tabs.displayName = 'Tabs';
