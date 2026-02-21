import { generateConnectedPipes, clearAllPipes, getPipeCount } from "./db";

// Get count from command line argument or default to 100K
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 100000;

if (isNaN(count) || count <= 0) {
  console.error("Error: Please provide a valid positive number");
  console.log("Usage: npm run generate-pipes [count]");
  console.log("Example: npm run generate-pipes 100000");
  process.exit(1);
}

console.log(`Starting pipe generation...`);
console.log(`Target: ${count.toLocaleString()} pipes`);

// Clear existing pipes
const existingCount = getPipeCount();
if (existingCount > 0) {
  console.log(`Clearing ${existingCount.toLocaleString()} existing pipes...`);
  clearAllPipes();
}

console.log("---");

const startTime = Date.now();

try {
  generateConnectedPipes(count);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  const finalCount = getPipeCount();
  
  console.log("---");
  console.log(`✓ Generation complete!`);
  console.log(`  Total pipes in database: ${finalCount.toLocaleString()}`);
  console.log(`  Time taken: ${duration}s`);
  console.log(`  Rate: ${Math.floor(count / parseFloat(duration)).toLocaleString()} pipes/second`);
} catch (error) {
  console.error("Error generating pipes:", error);
  process.exit(1);
}
