import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title + " | Airmailo";
  }, [title]);
};

export default usePageTitle;
