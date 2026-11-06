
import Course from "../models/cousreModel.js"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body

        if (!input) {
            return res.status(400).json({
                message: "Search query is required"
            })
        }

        const regex = new RegExp(input, 'i')

        const courses = await Course.find({
            isPublished: true,
            $or: [
                { title: regex },
                { subTitle: regex },
                { description: regex },
                { category: regex },
                { level: regex }
            ]
        })

        if (courses.length > 0) {
            return res.status(200).json(courses)
        }
        else {
            try {
                const ai = new GoogleGenAI({
                    apiKey: process.env.GEMINI_API_KEY,
                })

                const prompt = `You are an LMS course recommendation assistant.

Understand the user's query in ANY language, including Hindi and Hinglish.

Map the user's learning intent to exactly ONE category from this list:

- App Development
- AI/ML
- AI Tools
- Data Science
- Data Analytics
- Ethical Hacking
- UI UX Designing
- Web Development
- Others

User query: ${input}`

                const interaction = await ai.interactions.create({
                    model: "gemini-3.8-flash",
                    input: prompt,
                })

                const keyword = interaction.output_text.trim()

                console.log("Gemini keyword:", keyword)

                const keywordRegex = new RegExp(keyword, 'i')

                const courses = await Course.find({
                    isPublished: true,
                    $or: [
                        { title: keywordRegex },
                        { subTitle: keywordRegex },
                        { description: keywordRegex },
                        { category: keywordRegex },
                        { level: keywordRegex }
                    ]
                })

                return res.status(200).json(courses)

            } catch (error) {
                console.log("GEMINI ERROR:", error.message)

                return res.status(200).json([])
            }
        }

    } catch (error) {
        console.log("SEARCH ERROR:", error)

        return res.status(500).json({
            message: `Failed to search ${error.message}`
        })
    }
}
