import { Client } from "../client"

export {}

declare global {
  interface Window {
    engine: Client;
  }
}