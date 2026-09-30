import { Center, Loader } from "@mantine/core";

/** Suspense fallback for lazily loaded route chunks. */
const PageLoader = () => (
  <Center mih={280}>
    <Loader />
  </Center>
);

export default PageLoader;
