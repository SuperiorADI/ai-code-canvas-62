export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateProject(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate project');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function chatWithAI(messages: AIMessage[]): Promise<string> {
  // This function can be implemented similarly if needed
  throw new Error('Chat function not yet implemented');
}
