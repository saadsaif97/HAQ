import ProiorityGraph from "@/components/PriorityGraph";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PriorityLevels {
  LowPriority: number[];
  ModeratePriority: number[];
  HighPriority: number[];
}

interface OrganSystem {
  [key: string]: PriorityLevels;
}

interface HealthData {
  gastrointestinal: OrganSystem;
  liver: OrganSystem;
  endocrine: OrganSystem;
  glucoseRegulation: OrganSystem;
  cardio: OrganSystem;
  mood: OrganSystem;
  immune: OrganSystem;
  neuro_and_cognition: OrganSystem;
  male: OrganSystem;
  female: {
    menstrual_balance: PriorityLevels;
    reproductive_tissue_infla: PriorityLevels;
    hormone_balance: PriorityLevels;
  };
}

const healthData: HealthData = {
  gastrointestinal: {
    gastric_function: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
    smallintestine_pancreas: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
    colon: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  liver: {
    hepatobiliary_function: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  endocrine: {
    thyroid: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
    adrenal: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  glucoseRegulation: {
    dyglycemia: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  cardio: {
    cva: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  mood: {
    depression_anxiety_mood: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  immune: {
    immune: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  neuro_and_cognition: {
    cns_brain: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  male: {
    male_reproductive: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  female: {
    menstrual_balance: {
      LowPriority: [2, 4, 6, 8],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [32, 36, 40, 48],
    },
    reproductive_tissue_infla: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
    hormone_balance: {
      LowPriority: [2, 4, 6, 8],
      ModeratePriority: [16, 20, 24, 28],
      HighPriority: [34, 42, 54, 72],
    },
  },
};

async function fetchVariables(responseId: string | null | undefined) {
  if (!responseId) return;

  const res = await fetch("/api/formResponse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formId: "UWy7JY9v",
      responseId: responseId,
    }),
  });

  return await res.json();
}

type Results = {
  key: string;
  type: string;
  number: number;
  priority?: "HighPriority" | "LowPriority" | "ModeratePriority";
  min: number,
  max: number
}[];

export default function Response() {
  const searchParams = useSearchParams();

  const responseId = searchParams?.get("responseId");
  const [results, setResults] = useState<Results>([]);

  useEffect(() => {
    (async () => {
      let results = await fetchVariables(responseId);
      results = addPriorityToResults(results, healthData);
      console.log(results);
      setResults(results);
    })();
  }, [responseId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {results?.length > 1 &&
        results.map((variable) => {
          return (
            <div key={variable.key}>
              <p>
                {variable.key} | {variable.number} | {variable.priority}
              </p>
              <ProiorityGraph number={variable.number} min={variable.min} max={variable.max} />
            </div>
          );
        })}
    </main>
  );
}

// Function to add priority information to the results
function addPriorityToResults(results: Results, healthData: HealthData) {
  if (!results) return [];

  results.forEach((result) => {
    const { key, number } = result;

    // Iterate through the healthData structure to find the corresponding key
    for (const category in healthData) {
      for (const subCategory in healthData[category]) {
        if (key.toLowerCase() === subCategory.toLowerCase()) {
          const priorityLevels = healthData[category][subCategory];

          // Determine the priority based on the number value
          let priority;
          if (number >= priorityLevels.HighPriority[0]) {
            priority = "HighPriority";
          } else if (number >= priorityLevels.ModeratePriority[0]) {
            priority = "ModeratePriority";
          } else {
            priority = "LowPriority";
          }

          // Add the priority to the result object
          result.priority = priority;
          let min = healthData[category][subCategory].LowPriority[0]
          let max = healthData[category][subCategory].HighPriority[3]
          console.log(healthData[category][subCategory], {min, max})

          result.min = min
          result.max = max

          // Exit the loop once the key is found
          break;
        }
      }
    }
  });

  return results;
}
