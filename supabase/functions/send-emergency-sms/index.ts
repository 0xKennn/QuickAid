import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SEMAPHORE_API_KEY = Deno.env.get("SEMAPHORE_API_KEY");
const SEMAPHORE_URL = "https://api.semaphore.co/api/v4/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipients, message } = await req.json();

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SEMAPHORE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server not configured (missing SEMAPHORE_API_KEY)" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Semaphore accepts a comma-separated list of numbers in one call,
    // sending the same message to all of them.
    const numberList = recipients
      .map((n) => String(n).replace(/[^\d+]/g, ""))
      .join(",");

    const body = new URLSearchParams({
      apikey: SEMAPHORE_API_KEY,
      number: numberList,
      message,
      // sendername: "QUICKAID", // uncomment once a custom sender name is approved in the Semaphore dashboard
    });

    const semaphoreRes = await fetch(SEMAPHORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await semaphoreRes.json();

    if (!semaphoreRes.ok) {
      return new Response(
        JSON.stringify({ error: data?.message || "Semaphore API error", details: data }),
        { status: semaphoreRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});