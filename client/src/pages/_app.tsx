import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingSkeleton, { SkeletonItem } from "./LoadingSkeleton";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  return (
    <ChakraProvider>
      <Container maxW="2xl">
        {isLoading ? (
          <LoadingSkeleton>
            <SkeletonItem className={"h-5 w-full"} />
            <SkeletonItem className={"h-5 w-full"} />
            <SkeletonItem className={"h-5 w-full"} />
            <SkeletonItem className={"h-5 w-full"} />
          </LoadingSkeleton>
        ) : (
          <Component {...pageProps} />
        )}
      </Container>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
