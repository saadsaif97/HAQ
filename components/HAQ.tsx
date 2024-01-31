"use client";

import React, { useEffect } from "react";
import { createWidget } from "@typeform/embed";
import "@typeform/embed/build/css/widget.css";
import { useRouter } from "next/navigation";

export default function HAQ() {

  const router = useRouter()

  useEffect(() => {
    const { refresh, unmount } = createWidget("LtDX31MU", {
      container: document.querySelector("#form"),
      width: 1068,
      height: 600,
      async onSubmit(event) {
        router.push(`/response?responseId=${event.responseId}`)
      },
    });
  }, []);

  return <div id="form"></div>;
}
