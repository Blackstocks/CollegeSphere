// Define the structure for our Q&A database
export interface QuestionOption {
  id: string
  text: string
  answer: string
}

export interface QuestionSet {
  id: string
  options: QuestionOption[]
}

// Our database of question sets
export const QUESTION_SETS: QuestionSet[] = [
  {
    id: "set1",
    options: [
      {
        id: "q1",
        text: "What are the eligibility criteria for JEE counseling?",
        answer:
          "For IITs: Candidates must qualify JEE (Advanced) 2024 and satisfy Class XII performance criteria. For NITs/IIEST/IIITs/GFTIs: Candidates must have a rank in JEE (Main) 2024 and satisfy Class XII criteria. Class XII criteria: Either 75% aggregate marks (65% for SC/ST/PwD) OR be in the top 20 percentile.",
      },
      {
        id: "q2",
        text: "What are the different categories in JEE counseling?",
        answer:
          "JOSAA 2024 recognizes these categories: GEN (General), GEN-EWS (Economically Weaker Section), OBC-NCL (Other Backward Classes - Non-Creamy Layer), SC (Scheduled Castes), ST (Scheduled Tribes), PwD (Persons with Benchmark Disabilities), and Foreign (Non-Indian nationals).",
      },
      {
        id: "q3",
        text: "How does the seat allocation process work?",
        answer:
          "The JOSAA seat allocation process includes online registration and choice filling, multiple rounds of seat allocation, options to freeze, float, or slide after seat allocation, document verification and fee payment for seat acceptance, and withdrawal option available until the second-last round.",
      },
    ],
  },
  {
    id: "set2",
    options: [
      {
        id: "q4",
        text: "What are the fees for seat acceptance?",
        answer:
          "Seat Acceptance Fee: Rs. 35,000 for general candidates, Rs. 17,500 for SC/ST/PwD. Partial Admission Fee (for NIT+ only): Rs. 45,000 for general, Rs. 20,000 for SC/ST/PwD.",
      },
      {
        id: "q5",
        text: "What are supernumerary seats?",
        answer:
          "JOSAA offers supernumerary seats including female supernumerary seats to ensure at least 20% female enrollment and foreign candidate supernumerary seats in IITs (up to 10% of total seats).",
      },
      {
        id: "q6",
        text: "What documents are required for verification?",
        answer:
          "Document verification is mandatory for seat acceptance. Required documents include JEE admit card, JEE rank card, photo ID proof, DOB certificate, Class XII marksheet, category certificate (if applicable), PwD certificate (if applicable), and passport (for foreign nationals).",
      },
    ],
  },
  {
    id: "set3",
    options: [
      {
        id: "q7",
        text: "What is the withdrawal process and refund policy?",
        answer:
          "Candidates can withdraw from the seat allocation process until the second-last round. Refund policies vary based on when the withdrawal is made. The processing fee of Rs. 7,000 is non-refundable.",
      },
      {
        id: "q8",
        text: "What is the schedule for JEE counseling?",
        answer:
          "The JOSAA 2024 schedule includes registration, choice filling, seat allocation rounds, and document verification periods. Please check the official JOSAA website for the most current dates as they may be updated.",
      },
      {
        id: "q9",
        text: "What are freeze, float, and slide options?",
        answer:
          "After seat allocation, candidates have three options: Freeze (accept allocated seat and don't participate in further rounds), Float (accept current seat but be considered for higher preferences in all institutes), or Slide (accept current seat but be considered for higher preferences in the same institute only).",
      },
    ],
  },
]

// Function to get a question set by ID
export function getQuestionSet(id: string): QuestionSet | undefined {
  return QUESTION_SETS.find((set) => set.id === id)
}

// Function to get a question by ID
export function getQuestionById(id: string): QuestionOption | undefined {
  for (const set of QUESTION_SETS) {
    const question = set.options.find((q) => q.id === id)
    if (question) return question
  }
  return undefined
}

// Update the saveChatbotUser function with better error handling and logging
export async function saveChatbotUser(name: string, email: string, mobile: string, notes?: string) {
  try {
    console.log("Saving chatbot user:", { name, email, mobile, notes })

    const response = await fetch("/api/save-chatbot-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        mobile,
        notes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error response from save-chatbot-user API:", data)
      return { success: false, error: data.error || "Failed to save user data" }
    }

    console.log("Chatbot user saved successfully:", data)
    return data
  } catch (error) {
    console.error("Exception in saveChatbotUser:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error saving user data" }
  }
}
