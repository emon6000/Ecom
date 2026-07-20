import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // useLocation gives us the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Every time the pathname changes, instantly scroll to the top left
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component is invisible, it just runs logic!
};

export default ScrollToTop;