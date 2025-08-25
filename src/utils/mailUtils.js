import { updateProfile } from "../redux/slices/authSlice";
import {
  getAllArchive,
  getAllMails,
  getAllReceivedMails,
  getAllSentMails,
  getAllStarred,
  getTrash,
} from "../redux/slices/mailSlice";

export const refreshMailListByPath = (dispatch, currentPath) => {
  const routeToActionMap = {
    "/u/all-mails": getAllMails,
    "/u/inbox": getAllReceivedMails,
    "/u/sent": getAllSentMails,
    "/u/starred": getAllStarred,
    "/u/archive": getAllArchive,
    "/u/trash": getTrash,
    "/u/settings": updateProfile,
  };

  const actionToDispatch = routeToActionMap[currentPath];
  if (actionToDispatch) dispatch(actionToDispatch());
};
