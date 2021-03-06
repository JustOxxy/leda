import * as React from 'react';
import { htmlTagFactory } from '../../src/HTMLTagsFactory';

export interface ArticleProps extends React.HTMLAttributes<HTMLElement> {
  [x: string]: unknown,
}

export const Article = htmlTagFactory('Article') as React.FC<ArticleProps>;
