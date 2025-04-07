import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const aaia = createOpenAICompatible({
  baseURL: 'http://localhost:11435/v1',
  name: 'aaia',
  apiKey: 'fake-key',
});
