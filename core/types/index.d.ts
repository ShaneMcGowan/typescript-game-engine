import { type Client } from '@core/client';

export {};

declare global {
  interface Window {
    engine: Client;
  }
}
