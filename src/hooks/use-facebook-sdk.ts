import { useEffect, useState } from "react";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

export function useFacebookSDK() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.FB) {
      setLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "641733708474849",
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      setLoaded(true);
    };

    // Only add script if not already present
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(js);
    }
  }, []);

  return loaded;
}