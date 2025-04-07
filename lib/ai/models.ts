import { openai } from '@ai-sdk/openai';
import {customProvider} from 'ai';
import { aaia } from './provider';

export const DEFAULT_CHAT_MODEL: string = 'aaia-model';

export const myProvider = customProvider({
  languageModels: {
    'aaia-model': aaia.chatModel('aaia-model'),
    'chat-model-small': openai('gpt-4o-mini'),
    'chat-model-large': openai('gpt-4o-mini'),
    'title-model': openai('gpt-4o-mini'),
  }
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small Model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
];
