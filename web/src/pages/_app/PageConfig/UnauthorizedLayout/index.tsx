import { FC, ReactElement } from 'react';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

export default UnauthorizedLayout;
