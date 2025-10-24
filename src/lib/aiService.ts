export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateProject(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Claude API key is required');
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

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
      throw new Error(error.error?.message || 'Failed to generate project');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function chatWithAI(messages: AIMessage[], apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Claude API key is required');
  }

  // Separate system messages from user/assistant messages
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role,
      content: m.content
    }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: systemMessage,
        messages: conversationMessages
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to chat with AI');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
}
