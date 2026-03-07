const getRoleRedirectPath = (role) => {
  switch (role) {
    case "vendor":
      return "/vendor/dashboard/";
    case "customer":
      return "/";
    case "admin":
      return "/admin/dashboard/";
  }
};
export default getRoleRedirectPath;
