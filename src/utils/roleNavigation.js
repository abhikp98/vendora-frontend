const getRoleRedirectPath = (role) => {
  switch (role) {
    case "vendor":
      return "/vendor/dashboard";
    case "customer":
      return "/";
  }
};
export default getRoleRedirectPath;
