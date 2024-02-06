import puppeteer from "puppeteer";
import React from "react";

export default function generatePDF() {
  async function createPDF() {
    try {
      const res = await fetch("/api/generatePDF")
      const data = res.json()
      console.log({data})
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
