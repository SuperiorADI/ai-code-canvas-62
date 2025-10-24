import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
    if (!CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert web developer. Generate complete, working project code based on user requests. 
      
Your response should be a JSON object with this structure:
{
  "files": [
    {
      "path": "/src/index.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "path": "/src/App.tsx",
      "content": "import React..."
    }
  ],
  "description": "Brief description of what was created"
}

Generate complete, production-ready code. Include proper HTML, CSS, and JavaScript/TypeScript.
Make the UI beautiful and fully functional.`;

    console.log('Calling Claude API with prompt:', prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      throw new Error(error.error?.message || 'Failed to generate project');
    }

    const data = await response.json();
    console.log('Claude API response received');
    
    return new Response(JSON.stringify({ text: data.content[0].text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-project function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
