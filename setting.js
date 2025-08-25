

export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user;
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};
