import type { FormInputs } from "../src/types";

// This is a serverless function that acts as a proxy.
// It assumes a Vercel/Netlify-like environment that supports this type of export.
// Your API_KEY must be set as an environment variable in your hosting platform.

export const config = {
  runtime: 'edge', // Using edge runtime for speed
};

const SYSTEM_PROMPT = `[START OF PROMPT]

ROLE AND GOAL

You are 'MainsAnswer-GPT', an expert AI assistant for the UPSC Civil Services Mains Examination. Your primary goal is to generate comprehensive, well-structured, and high-scoring model answers.

GUIDING PRINCIPLES

- Analytical Depth, Not Just Description.
- Balanced and Nuanced Perspective.
- Structure is Paramount.
- Indian Context: Use Constitution, SC judgments, reports (ARC), Economic Survey, schemes.
- Solution-Oriented and Forward-Looking.
- Clarity and Precision.
- Strict Adherence to Word Limit (+/- 5%).

OUTPUT FORMAT

You MUST return a single, valid JSON object. Do NOT include any markdown formatting like \`\`\`json or trailing text. The JSON object must have the following exact structure:
{
  "chainOfThought": "Your detailed strategy, how you deconstructed the question, and the structure you will follow.",
  "modelAnswer": "The full model answer, formatted with Markdown for readability (e.g., **Introduction**, **Body**, **Conclusion** headings, bold keywords).",
  "valueAddition": "A final section formatted with Markdown, containing **Keywords** and **Key References**."
}

[END OF PROMPT]`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY environment variable not set on the server.");
    return new Response(JSON.stringify({ error: 'Server configuration error. The API key is missing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const inputs: FormInputs = await req.json();

    if (!inputs.subject || !inputs.question || !inputs.wordLimit) {
        return new Response(JSON.stringify({ error: 'Invalid input. Subject, question, and word limit are required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const userPrompt = `
    Based on the principles and workflow, generate a model answer for the following UPSC Mains question. Return the response as a single, valid JSON object with the specified keys.

    - **SUBJECT**: ${inputs.subject}
    - **QUESTION**: "${inputs.question}"
    - **WORD_LIMIT**: ${inputs.wordLimit} words
    `;

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }, // Enforce JSON output
        temperature: 0.5,
        top_p: 0.95,
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("Error from OpenRouter API:", errorData);
      return new Response(JSON.stringify({ error: `API Error: ${errorData.error?.message || openRouterResponse.statusText}` }), {
        status: openRouterResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await openRouterResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "Received an empty response from the API." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // The content is a JSON string, so we return it directly with the correct content type.
    // The client will parse it.
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in proxy handler:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: `An internal server error occurred: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}