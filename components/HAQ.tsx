"use client";

import React, { useEffect } from "react";
import { createWidget } from "@typeform/embed";
import "@typeform/embed/build/css/widget.css";
import { useRouter } from "next/navigation";

export default function HAQ() {

  const router = useRouter()

  useEffect(() => {
    const { refresh, unmount } = createWidget("UWy7JY9v", {
      container: document.querySelector("#form")!,
      width: 1068,
      height: 600,
      async onSubmit(event) {
        // @TODO: get email and send pdf in attachment
        const email =  await getEmail(event.responseId);
        console.log({email})
        await createPDF(event.responseId, email)
        router.push(`/response?responseId=${event.responseId}`)
      },
    });
  }, []);

  return <div id="form"></div>;
}

async function getEmail(responseId: string | null | undefined) {
  if (!responseId) return;

  try {
    const res = await fetch("http://localhost:3000/api/responseEmail", {
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

async function createPDF(responseId: string, email: string) {
  const res = await fetch("/api/generatePDF", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formId: "UWy7JY9v",
      responseId,
      email
    }),
  });
  const data = await res.json()
  console.log({data})
}
