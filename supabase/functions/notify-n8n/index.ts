import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Lấy thông tin user từ body (nếu có)
    const { user_id, email } = await req.json();

    // Gửi GET request đến webhook n8n
    const webhookUrl = `https://n8n.vietnamaisolution.com/webhook/create-id?user_id=${encodeURIComponent(user_id)}&email=${encodeURIComponent(email)}`;
    await fetch(webhookUrl, { method: "GET" });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});