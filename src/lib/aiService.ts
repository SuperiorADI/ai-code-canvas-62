export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateProject(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an expert web developer. Generate complete, working project code based on user requests. 
      
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
Make the UI beautiful and fully functional.`
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate project');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function chatWithAI(messages: AIMessage[], apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to chat with AI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
}
