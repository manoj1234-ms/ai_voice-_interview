import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";


export async function POST(request: Request) {
  const { type, role, level, techStack, amount, userid } = await request.json();
   
    if (!userid) {
    return Response.json(
      { success: false, error: "Missing userId in request body" },
      { status: 400 }
    );
  }


  try {
    const { text: questions } = await generateText({
      model: google("gemini-1.5-flash-latest"), // ✅ use valid model
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioral and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        Return format:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });

    const interview = {
      role,
      type,
      level,
      techStack: techStack.split(","),
      questions: JSON.parse(questions),
      userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return Response.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
