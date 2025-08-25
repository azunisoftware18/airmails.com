import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title + " | Airmails";
  }, [title]);
};

export default usePageTitle;
