import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: "6a35766791f303e104782bbe",
  token: "38e962cbb69d4398a6061ea25b02761b", // SDK mein aam tor par api_key ko token kehte hain
  headers: {
    "api_key": "38e962cbb69d4398a6061ea25b02761b"
  }
});