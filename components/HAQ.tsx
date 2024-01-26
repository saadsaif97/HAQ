"use client";

import React, { useEffect } from "react";
import { createWidget } from "@typeform/embed";
import "@typeform/embed/build/css/widget.css";
import { useRouter } from "next/navigation";

async function fetchResponse(formId: string, responseId: string) {
  const accessToken =
    "tfp_GedqovrmeL99YUrEBR8etQXut8jdYMer1eXBaqezTxqW_3peGw8t3j6cdAN";

  const apiUrl = `https://api.typeform.com/forms/${formId}/responses?response_id=${responseId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // Process the response data
    console.log({ data });

    return data; // You can return the data if needed
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error if needed
  }
}

export default function HAQ() {

  const router = useRouter()

  useEffect(() => {
    const { refresh, unmount } = createWidget("LtDX31MU", {
      container: document.querySelector("#form"),
      width: 1068,
      height: 600,
      async onSubmit(event) {
        // await fetchResponse(event.formId, event.responseId)
        const res = await fetch("/api/formResponse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: event.formId,
            responseId: event.responseId,
          }),
        });
        const data = await res.json();
        const queryParams = data.answers.map((answer: any) => {
          const key = Object.keys(answer)[0];
          const value = answer[key];
          return encodeURIComponent(key) + "=" + encodeURIComponent(value);
        });

        const queryString = queryParams.join('&');
        console.log({ event, data, queryString });

        router.push(`/response?${queryString}`)
      },
    });
  }, []);

  return <div id="form"></div>;
}
