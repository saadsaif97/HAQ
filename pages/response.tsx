import ProiorityGraph from "@/components/PriorityGraph";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PriorityLevels {
  LowPriority: number[];
  ModeratePriority: number[];
  HighPriority: number[];
  min?: number;
  max?: number;
  priority?: string;
  result?: number;
}

interface OrganSystem {
  [key: string]: PriorityLevels;
}

interface HealthData {
  Gastrointestinal: OrganSystem;
  Liver: OrganSystem;
  Endocrine: OrganSystem;
  "Glucose Regulation": OrganSystem;
  Cardio: OrganSystem;
  Mood: OrganSystem;
  Immune: OrganSystem;
  "Neuro and Cognition": OrganSystem;
  Male: OrganSystem;
  Female: {
    menstrual_balance: PriorityLevels;
    reproductive_tissue_infla: PriorityLevels;
    hormone_balance: PriorityLevels;
  };
}

const healthData: HealthData = {
  Gastrointestinal: {
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
  Liver: {
    hepatobiliary_function: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  Endocrine: {
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
  "Glucose Regulation": {
    dyglycemia: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  Cardio: {
    cva: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  Mood: {
    depression_anxiety_mood: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  Immune: {
    immune: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  "Neuro and Cognition": {
    cns_brain: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [10, 12, 14, 16],
      HighPriority: [20, 28, 36, 48],
    },
  },
  Male: {
    male_reproductive: {
      LowPriority: [1, 2, 3, 4],
      ModeratePriority: [5, 6, 7, 8],
      HighPriority: [16, 24, 32, 40],
    },
  },
  Female: {
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

  try {
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
  } catch (error) {
    console.log({error});
    return (error)
  }
}

type Results = {
  key: string;
  type: string;
  number: number;
  priority?: "HighPriority" | "LowPriority" | "ModeratePriority";
  min: number;
  max: number;
}[];

export default function Response() {
  const searchParams = useSearchParams();

  const responseId = searchParams?.get("responseId");
  const [data, setData] = useState(healthData);

  useEffect(() => {
    (async () => {
      let results = await fetchVariables(responseId);
      let newHealthData = addResultsToHealthData(results, healthData);
      console.log(newHealthData);
      // @ts-ignore
      setData(newHealthData);
    })();
  }, [responseId]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.5rem",
      }}
    >
      {Object.entries(data).map(([category, subcategories]) => (
        <div key={category} style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          padding: "1.5rem",
          borderTop: "1px solid #e9e9e9",
          borderLeft: "1px solid #e9e9e9",
          borderRight: "1px solid #e9e9e9"
        }}>
          <h2>{category}</h2>
          {Object.entries(subcategories).map(([organ, organData]) => (
            <div key={organ} style={{
              padding: "0.5rem",
              borderTop: "1px solid #efefef",
            }}>
              <ProiorityGraph
                organ={organ}
                // @ts-ignore
                number={organData.result}
                // @ts-ignore
                min={organData.min}
                // @ts-ignore
                max={organData.max}
              />
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}

function addResultsToHealthData(results: Results, healthData: HealthData) {
  if (!results?.length) return [];

  results?.forEach((result) => {
    const { key, number } = result;

    // Iterate through the healthData structure to find the corresponding key
    for (const category in healthData) {
      // @ts-ignore
      for (const subCategory in healthData[category]) {
        if (key.toLowerCase() === subCategory.toLowerCase()) {
          // @ts-ignore
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
          // @ts-ignore
          healthData[category][subCategory].priority = priority;
          // @ts-ignore
          let min = healthData[category][subCategory].LowPriority[0];
          // @ts-ignore
          let max = healthData[category][subCategory].HighPriority[3];

          // @ts-ignore
          healthData[category][subCategory].min = min;
          // @ts-ignore
          healthData[category][subCategory].max = max;
          // @ts-ignore
          healthData[category][subCategory].result = number;

          // Exit the loop once the key is found
          break;
        }
      }
    }
  });

  return healthData;
}
