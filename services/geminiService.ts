import type { FormInputs, UPSCAnswer } from "../types";

export const generateUPSCAnswer = async (inputs: FormInputs): Promise<UPSCAnswer> => {
    try {
        const response = await fetch("/api/proxy", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs)
        });

        const data = await response.json();

        if (!response.ok) {
            // The proxy returns a JSON object with an 'error' key on failure.
            throw new Error(data.error || `Server responded with status ${response.status}`);
        }

        // The proxy now returns the full, structured answer object.
        if (!data.chainOfThought || !data.modelAnswer || !data.valueAddition) {
          throw new Error("Received an invalid or incomplete answer structure from the server.");
        }

        return data as UPSCAnswer;

    } catch (error) {
        console.error("Error generating answer via proxy:", error);
        if (error instanceof Error) {
          // Re-throw the specific error message from the server or fetch failure.
          throw new Error(`Failed to generate answer: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the server.");
    }
};