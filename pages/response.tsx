import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

async function fetchVariables(responseId: string) {
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

export default function Response() {
  const searchParams = useSearchParams();

  const responseId = searchParams?.get("responseId");
  const [variables, setVariables] = useState<{key: string, type: string, number: number}[]>([])

  useEffect(() => {
    (async () => {
      let variables = await fetchVariables(responseId);
      console.log(variables);
      setVariables(variables)
    })();
  }, [responseId]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {variables.length > 1 && variables.map((variable) => {
        return (<p>{variable.key} | {variable.number}</p>);
      })}
    </main>
  );
}
