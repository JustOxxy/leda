import React from 'react';
import { LedaContext } from './LedaContext';
import { globalDefaultTheme } from './globalDefaultTheme';
import { PartialGlobalDefaultTheme } from '../../utils/useTheme';
import { globalDefaultRenders, GlobalDefaultRenders } from './globalDefaultRenders';

export interface LedaProps {
  children: React.ReactNode,
  theme?: PartialGlobalDefaultTheme,
  renders?: GlobalDefaultRenders,
}

export const Leda = ((props: LedaProps): React.ReactElement => {
  const { theme = globalDefaultTheme, renders = globalDefaultRenders, children } = props;

  const context = { theme, renders };

  return (
    <LedaContext.Provider value={context}>
      {children}
    </LedaContext.Provider>
  );
}) as React.FC<LedaProps>;

export { LedaContext } from './LedaContext';
export { globalDefaultTheme } from './globalDefaultTheme';
