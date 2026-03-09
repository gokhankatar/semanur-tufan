export default defineNuxtPlugin(() => {
  const router = useRouter();
  router.beforeEach((to, from, next) => {
    if (to.path.startsWith("/admin") && !from.path.startsWith("/admin")) {
      window.location.assign(to.fullPath);
      return;
    }
    next();
  });
});
