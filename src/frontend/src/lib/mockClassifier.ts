export interface ClassificationResult {
  itemType: string;
  disposalMethod: string;
  environmentalTip: string;
  funFact: string;
  points: number;
}

const wasteDatabase: Record<string, ClassificationResult> = {
  plastic: {
    itemType: 'Plastic',
    disposalMethod: 'Recycle',
    environmentalTip: 'Avoid single-use plastics whenever possible.',
    funFact: 'It can take up to 1,000 years for plastic to decompose!',
    points: 10,
  },
  bottle: {
    itemType: 'Plastic',
    disposalMethod: 'Recycle',
    environmentalTip: 'Rinse bottles before recycling to prevent contamination.',
    funFact: 'Recycling one plastic bottle can save enough energy to power a light bulb for 3 hours.',
    points: 10,
  },
  organic: {
    itemType: 'Organic',
    disposalMethod: 'Compost',
    environmentalTip: 'Composting reduces methane emissions from landfills.',
    funFact: 'Composting can reduce household waste by up to 30%.',
    points: 10,
  },
  banana: {
    itemType: 'Organic',
    disposalMethod: 'Compost',
    environmentalTip: 'Banana peels make excellent compost material.',
    funFact: 'Banana peels decompose in about 2-5 weeks in a compost bin.',
    points: 10,
  },
  metal: {
    itemType: 'Metal',
    disposalMethod: 'Recycle',
    environmentalTip: 'Recycling one aluminum can saves enough energy to power a TV for 3 hours.',
    funFact: 'Metal can be recycled indefinitely without losing quality.',
    points: 10,
  },
  aluminum: {
    itemType: 'Metal',
    disposalMethod: 'Recycle',
    environmentalTip: 'Aluminum is one of the most recyclable materials.',
    funFact: 'Recycling aluminum uses 95% less energy than producing new aluminum.',
    points: 10,
  },
  can: {
    itemType: 'Metal',
    disposalMethod: 'Recycle',
    environmentalTip: 'Rinse cans before recycling.',
    funFact: 'A recycled aluminum can returns to the shelf as a new can in just 60 days.',
    points: 10,
  },
  paper: {
    itemType: 'Paper',
    disposalMethod: 'Recycle',
    environmentalTip: 'Recycling paper saves trees and reduces energy consumption.',
    funFact: 'Every ton of recycled paper saves 17 trees.',
    points: 10,
  },
  cardboard: {
    itemType: 'Paper',
    disposalMethod: 'Recycle',
    environmentalTip: 'Flatten cardboard boxes to save space in recycling bins.',
    funFact: 'Cardboard can be recycled 5-7 times before the fibers become too short.',
    points: 10,
  },
  glass: {
    itemType: 'Glass',
    disposalMethod: 'Recycle',
    environmentalTip: 'Glass is 100% recyclable and can be reused indefinitely.',
    funFact: 'Recycling glass reduces water pollution by 50%.',
    points: 10,
  },
  jar: {
    itemType: 'Glass',
    disposalMethod: 'Recycle',
    environmentalTip: 'Remove lids and rinse jars before recycling.',
    funFact: 'Glass never wears out and can be recycled forever.',
    points: 10,
  },
  battery: {
    itemType: 'E-Waste',
    disposalMethod: 'Special Handling',
    environmentalTip: 'Never dispose of batteries in regular trash.',
    funFact: 'Batteries contain toxic materials that can contaminate soil and water.',
    points: 10,
  },
  electronic: {
    itemType: 'E-Waste',
    disposalMethod: 'Special Handling',
    environmentalTip: 'Take electronics to designated e-waste recycling centers.',
    funFact: 'E-waste contains valuable metals like gold, silver, and copper.',
    points: 10,
  },
  phone: {
    itemType: 'E-Waste',
    disposalMethod: 'Special Handling',
    environmentalTip: 'Donate or recycle old phones instead of throwing them away.',
    funFact: 'One million recycled cell phones can recover 35,000 pounds of copper.',
    points: 10,
  },
};

export function classifyWaste(input: string): ClassificationResult {
  const lowerInput = input.toLowerCase().trim();

  // Try exact match first
  if (wasteDatabase[lowerInput]) {
    return wasteDatabase[lowerInput];
  }

  // Try partial matches
  for (const [key, value] of Object.entries(wasteDatabase)) {
    if (lowerInput.includes(key) || key.includes(lowerInput)) {
      return value;
    }
  }

  // Unknown item
  return {
    itemType: 'Unknown',
    disposalMethod: 'Check local guidelines',
    environmentalTip: 'When in doubt, check local recycling guidelines.',
    funFact: 'Proper waste classification helps protect the environment.',
    points: 0,
  };
}
