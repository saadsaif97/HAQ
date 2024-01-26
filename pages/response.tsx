import { useSearchParams } from "next/navigation";

const QUESTIONS = [
  {
    "7caa2985-7e27-47ec-9120-9ebd35f753f9":
      "1\nPlease enter your email address.",
  },
  {
    "07b3cac0-5065-418a-95d5-4bb26545bbb9": "2\nPlease enter your user name.",
  },
  {
    "56d15112-78d7-4725-91cb-e1f3b978a0ef": "3\nWhat is your favorite color?",
  },
  {
    "0bf3ba40-4a10-45be-add3-8d8db2dbcfc9":
      "4\nHow many cups of coffee do you dr... per day?",
  },
  {
    "73afd6b2-da79-4b0d-a368-0ea5a321e167": "5\nWhat is your age?",
  },
  {
    "68b30255-e0c4-4b89-b374-fff7296fb8c0": "6\nWhich country are you from?",
  },
];

export default function Response() {
  const searchParams = useSearchParams();
  const QA: [{ question: string; answer: string }] = [];
  QUESTIONS.forEach((question: any) => {
    let ref = Object.keys(question)[0];
    let answer = searchParams?.get(ref);
    QA.push({ question: question[ref], answer });
  });

  console.log(QA);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {QA.map((q) => {
        return (
          <details>
            <summary>
              <span>{q.question}</span>
            </summary>
            <div>
              <p>{q.answer}</p>
            </div>
          </details>
        );
      })}
    </main>
  );
}
