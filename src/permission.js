import router from "./router";
// import store from "./store";
// import { Message } from "element-ui";
// import NProgress from "nprogress"; // progress bar
// import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

// NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/dang-nhap"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/dang-nhap") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      // NProgress.done();
    } else {
      next();
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          // Message.error(error || "Has Error");
          next(`/dang-nhap?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1 || (to.meta && to.meta.role === 1)) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next();

      next(`/dang-nhap?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  // NProgress.done();
});


/**
 * The navigation guard checks if the user is logged in by verifying the existence of a token.
If the user is logged in and tries to access the login page, they are redirected to the home page.
If the user is logged in but lacks user information, an attempt is made to fetch that information.
If the user is not logged in, they are either allowed to access public routes or redirected to the login page if they attempt to access protected routes.
This structure ensures that only authenticated users can access certain routes, enhancing the security of the application.
 */