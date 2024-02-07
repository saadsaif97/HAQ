import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";

type ResponseData = {
  response?: string,
  error?: unknown
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

    return pdf
  } catch (error) {
    console.log({ error });
  }
}

function sendEmail(pdf: any) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "saadgfx97@gmail.com",
      pass: "jskccvmtrjgqsrih",
    }
  });

  const mailOptions = {
    from: "saadgfx97@gmail.com",
    to: "msaadbinsaif@gmail.com",
    subject: "TEST SUBJECT",
    text: "This is a test email sent using Nodemailer.",
    attachments: [{
      filename: "Results.pdf",
      content: pdf
  }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    let PDF = await createPDF();
    sendEmail(PDF);
    res.json({response: "PDF Created successfully"})
  } catch (error) {
    res.json({error: error})
  }
}
