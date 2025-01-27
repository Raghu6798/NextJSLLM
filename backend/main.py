from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for the frontend URL (adjust the origin URL as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Set up LangChain chat model
chat_model = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=os.getenv("GROQ_API_KEY"))

@app.get("/chat/{message}")
async def chat(message: str):
    response = chat_model.invoke(message)
    return {"response": response.content}