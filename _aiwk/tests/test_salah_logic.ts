
import { chatEngine } from '../../src/lib/chatbot/engine';

async function testSalahLogic() {
  console.log("Testing Mohamed Salah logic...");
  
  // Simulate user asking for Mohamed Salah
  const response = await chatEngine.processMessage("Do you have Mohamed Salah items?");
  
  console.log("Bot Response:", response.message);
  
  if (response.message.includes("We don't currently have Mohamed Salah memorabilia in stock")) {
    console.log("FAIL: Bot incorrectly claims Salah items are out of stock.");
    if (response.products && response.products.length > 0) {
      console.log("...but it returned products:", response.products.map(p => p.title));
      const hasSalah = response.products.some(p => p.title.includes('Salah'));
      if (hasSalah) {
         console.log("...and some of them ARE Salah items! This confirms the logic error.");
      }
    }
  } else if (response.message.includes("Yes!") || response.message.includes("Great news!")) {
    console.log("PASS: Bot correctly found Salah items.");
  } else {
    console.log("UNKNOWN: Unexpected response.");
  }
}

testSalahLogic();
