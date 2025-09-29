import 'server-only'
import { promises as fs } from 'fs';
import path from 'path';

// Define a type for our dictionary structure for type safety.
// We can expand this later.
type Dictionary = { [key: string]: any };

// The function to get the dictionary.
// It's async because we're reading a file.
export const getDictionary = async (): Promise<Dictionary> => {
  // Construct the absolute path to the JSON file.
  const filePath = path.join(process.cwd(), 'content', 'es.json');
  
  // Read the file content.
  const fileContent = await fs.readFile(filePath, 'utf8');
  
  // Parse the JSON and return it.
  const dictionary = JSON.parse(fileContent);
  
  return dictionary;
};
