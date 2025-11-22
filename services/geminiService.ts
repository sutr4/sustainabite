
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini Client
// NOTE: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
  private chat: Chat | null = null;
  private inventoryContext: string = "";

  constructor(products: Product[]) {
    this.updateInventoryContext(products);
  }

  public updateInventoryContext(products: Product[]) {
    // Create a string representation of the inventory for the AI
    const inventoryStr = products.map(p => 
      `- ${p.name} ($${p.price}/${p.unit}) sold by ${p.businessName} at ${p.location}. ${p.originalPrice ? `(DISCOUNTED from $${p.originalPrice})` : ''} ID: ${p.id}`
    ).join('\n');

    this.inventoryContext = `
      You are Food Buddy, the AI assistant for SustainaBite, a local food marketplace connecting consumers with farms and businesses to reduce waste and promote fresh eating.
      
      CURRENT INVENTORY AVAILABLE ON SUSTAINABITE:
      ${inventoryStr}

      YOUR ROLE:
      1. Help users find food items based on price, location, or dietary needs.
      2. Suggest recipes based *strictly* on the ingredients available in the inventory above. If a user asks for a recipe, try to use as many items from the inventory as possible and explicitly mention which items can be bought on SustainaBite.
      3. If the user asks to "find meal under $X", calculate the total cost of ingredients from the inventory.
      4. If a user asks for something not in the inventory (like "restaurants nearby"), use your Google Maps tool to find real-world locations, but ALWAYS prioritize promoting SustainaBite's inventory first if applicable.
      
      TONE:
      Friendly, helpful, eco-conscious, and food-loving.
    `;
  }

  public async startChat() {
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: this.inventoryContext,
        tools: [{ googleMaps: {} }], // Enable Maps for "near me" queries outside inventory
      }
    });
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      await this.startChat();
    }

    if (!this.chat) throw new Error("Failed to initialize chat");

    try {
      const resultStream = await this.chat.sendMessageStream({ message });
      
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        yield c.text;
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  }
}