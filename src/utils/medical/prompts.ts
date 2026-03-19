import {MEDICAL_FIELDS} from './fields';

/**
 * Builds the extraction prompt for the vision model.
 * Returns a prompt string instructing the model to extract all medical fields
 * from the document image and respond with a strict JSON object.
 */
export function buildExtractionPrompt(): string {
  const fieldEntries = MEDICAL_FIELDS.map(f => `  "${f.name}": null`).join(
    ',\n',
  );

  return `You are a medical document data extraction assistant. Carefully examine this medical document image and extract the values for every field listed below.

RESPONSE FORMAT:
- Return ONLY a valid JSON object. No markdown, no explanation, no code blocks.
- Use the exact field names as keys.
- For numerical fields: return a number (integer or decimal), e.g. 12 or 3.5
- For measurement fields: return the value with unit as a string, e.g. "3.5 kg" or "110 cm"
- For text fields: return the text exactly as written in the document
- If a field is not present or not legible in the document, use null

JSON template to fill (replace null with extracted value where found):
{
${fieldEntries}
}`;
}

/**
 * Parses the raw model output into a key-value extraction result.
 * Handles common model output patterns: bare JSON, markdown code blocks.
 */
export function parseExtractionResult(
  rawText: string,
): Record<string, string | number | null> {
  let text = rawText.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Find the outermost JSON object if there is surrounding text
  const objectStart = text.indexOf('{');
  const objectEnd = text.lastIndexOf('}');
  if (objectStart !== -1 && objectEnd > objectStart) {
    text = text.slice(objectStart, objectEnd + 1);
  }

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, string | number | null>;
    }
  } catch {
    // Fall through to empty result
  }

  return {};
}
