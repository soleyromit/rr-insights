import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string };

/**
 * Adapter handed to Astryx's LinkProvider: internal hrefs go through
 * react-router; absolute URLs fall back to a plain anchor.
 */
export const RouterLinkAdapter = forwardRef<HTMLAnchorElement, Props>(
  function RouterLinkAdapter({ href = '', ...rest }, ref) {
    if (/^[a-z]+:/i.test(href)) {
      return <a ref={ref} href={href} {...rest} />;
    }
    return <RouterLink ref={ref} to={href} {...rest} />;
  }
);
