import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

type SessionContextType = {
  session: Session | null;
  user: Session["user"] | null;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
});

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      // Gửi thông tin về webhook n8n sau khi xác thực email thành công (SIGNED_IN)
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        // Kiểm tra localStorage để tránh gửi trùng lặp
        const notifiedKey = `n8n_notified_${user.id}`;
        if (!localStorage.getItem(notifiedKey)) {
          try {
            await fetch("https://ybnvoriewslmuwgfpdtf.supabase.co/functions/v1/notify-n8n", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.id, email: user.email }),
            });
            localStorage.setItem(notifiedKey, "1");
          } catch (e) {
            // Có thể log lỗi nếu cần
            // console.error("Failed to notify n8n:", e);
          }
        }
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, user: session?.user ?? null }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}