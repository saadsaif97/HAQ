import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  error?: unknown;
  answers?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const formId = req.body?.formId;
    const responseId = req.body?.responseId;

    if (!formId || !responseId) {
      res
        .status(400)
        .json({ error: "Form id and response id both are required" });
    }

    const variables = await fetchResponse(formId, responseId);
    res
      .status(200)
      .json(variables);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function fetchResponse(formId: string, responseId: string) {
  const apiUrl = `https://api.typeform.com/forms/${formId}/responses?included_response_ids=${responseId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `bearer ${process.env.TYPE_FORM_ACESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data?.items[0]?.variables
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error if needed
  }
}
