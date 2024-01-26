import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  name?: string;
  formId?: string;
  responseId?: string;
  error?: unknown;
  formResponse?: unknown;
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

    const formResponse = await fetchResponse(formId, responseId);
    res
      .status(200)
      .json({ name: "John Doey", formId, responseId, formResponse });
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
    // Process the response data
    console.log({ data });
    const answers = data.items[0].answers;

    let formattedAnswers = answers.map((answer: any) => {
      let type = answer.type;
      let ref = answer.field.ref;
      if (type == "choice") {
        return { [ref]: answer[type].label };
      }
      return { [ref]: answer[type] };
    });

    console.log({formattedAnswers})

    return formattedAnswers
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error if needed
  }
}
