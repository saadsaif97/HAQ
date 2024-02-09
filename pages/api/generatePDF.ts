import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";

type ResponseData = {
  response?: string;
  error?: unknown;
};

async function createPDF(responseId: string) {
  try {
    const URL =
      `http://localhost:3000/response?responseId=${responseId}`;

    // Create a browser instance
    const browser = await puppeteer.launch();
    // Create a new page
    const page = await browser.newPage();
    // Open URL in current page
    await page.goto(URL, { waitUntil: "networkidle2" });
    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    const scrollDimension = await page.evaluate( () => {
      return {
        width: document.scrollingElement.scrollWidth,
        height: document.scrollingElement.scrollHeight
      }
    })

    // Downlaod the PDF
    const pdf = await page.pdf({
      path: "result.pdf",
      printBackground: true,
      width: scrollDimension.width,
      height: scrollDimension.height
    });

    // Close the browser instance
    await browser.close();

    return pdf;
  } catch (error) {
    console.log({ error });
  }
}

function sendEmail(pdf: any, email: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "saadgfx97@gmail.com",
      pass: "jskccvmtrjgqsrih",
    },
  });

  const mailOptions = {
    from: "saadgfx97@gmail.com",
    to: email,
    subject: "TEST SUBJECT",
    text: "This is a test email sent using Nodemailer.",
    attachments: [
      {
        filename: "Results.pdf",
        content: pdf,
      },
    ],
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
    const responseId = req.body?.responseId;
    const email = req.body?.email;
    let PDF = await createPDF(responseId);
    sendEmail(PDF, email);
    res.json({ response: "PDF Created successfully " + responseId + " " + email });
  } catch (error) {
    res.json({ error: error });
  }
}
