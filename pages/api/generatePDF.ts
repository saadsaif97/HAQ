import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type ResponseData = {
  response?: string,
  error?: string
};

async function createPDF() {
  try {
    const URL =
      "http://localhost:3000/response?responseId=f0a4hhhhd1gr5dmujf0a4hf6ue63jvy4";

    // Create a browser instance
    const browser = await puppeteer.launch();
    // Create a new page
    const page = await browser.newPage();
    // Open URL in current page
    await page.goto(URL, { waitUntil: "networkidle2" });
    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Downlaod the PDF
    const pdf = await page.pdf({
      path: "result.pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });

    // Close the browser instance
    await browser.close();
  } catch (error) {
    console.log({ error });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.json({response: "PDF created"})
}
