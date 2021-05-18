import {useEffect} from "react";
import {useRouter} from "next/router";

import * as gtag from "../lib/gtag";

export default function usePageView() {
  const router = useRouter();

  useEffect(() => {
    if (!gtag.existsGaId) {
      return;
    }

    const handleRouteChange = (path) => {
      gtag.pageview(path);
    };

    router.events.on("roteChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Feature detects Navigation Timing API support.
  if (process.browser) {
    if (window.performance) {
      // Gets the number of milliseconds since page load
      // (and rounds the result since the value must be an integer).
      const timeSincePageLoad = Math.round(performance.now());
      const timeUserFeelPageLoaded = Math.round(performance.timing.domInteractive - performance.timing.navigationStart);

      // Sends the timing event to Google Analytics.
      gtag.userTiming({
        name: "load",
        value: timeSincePageLoad,
        event_category: "JS Dependencies",
      });

      gtag.userTiming({
        name: "user_feel_page_loaded",
        value: timeUserFeelPageLoaded,
        event_category: "JS Dependencies",
      });
    }
  }
}