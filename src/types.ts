export type RootsDirection = 'left' | 'right';

export type Tree = {
  key: string;
  title: string;
  children: Tree[];
  collapsable: boolean;
  path?: string;
  direction?: RootsDirection;
}

export interface EnhanceAppFilesResult {
  name: string;
  content: string;
}
