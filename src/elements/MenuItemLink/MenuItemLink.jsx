// @flow
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';

import type {Node} from 'react';

type Props = {
  to: string,
  onClick?: (e: Event) => void,
  children?: Node,
};

export function MenuItemLink(props: Props) {
  const {to, children} = props;

  const renderLink = useMemo(
    () => React.forwardRef((itemProps, ref) =>
      <Link to={to}
            ref={ref}
            {...itemProps} />),
    [to],
  );

  return (
    <MenuItem component={renderLink} {...(props: any)}>{children}</MenuItem>
  );
}

MenuItemLink.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
};