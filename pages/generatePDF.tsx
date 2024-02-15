import React from "react";

export default function generatePDF() {
  async function createPDF() {
    try {
      const email = await getEmail("f0a4hhhhd1gr5dmujf0a4hf6ue63jvy4");
      console.log({ email });
      const res = await fetch("/api/generatePDF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: "UWy7JY9v",
          responseId: "f0a4hhhhd1gr5dmujf0a4hf6ue63jvy4",
          email: "msaadbinsaif@gmail.com",
        }),
      });
      const data = await res.json();
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div>
      <button onClick={() => createPDF()}>CREATE PDF</button>
    </div>
  );
}

async function getEmail(responseId: string | null | undefined) {
  if (!responseId) return;

  try {
    const res = await fetch(
      "https://unit203-haq.vercel.app/api/responseEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: "UWy7JY9v",
          responseId: responseId,
        }),
      }
    );

    return await res.json();
  } catch (error) {
    console.log({ error });
    return error;
  }
}
