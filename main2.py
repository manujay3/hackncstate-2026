from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import json
import os

# Import your working agent logic
from agent import analyze_url

app = FastAPI(title="SecureLink API")

# --- Request/Response Models ---
class AnalysisRequest(BaseModel):
    url: str

class AnalysisResponse(BaseModel):
    job_id: str
    status: str
    target_url: str
    screenshot_url: str
    result: dict

# --- API Endpoints ---

@app.get("/")
async def root():
    return {"message": "SecureLink API is online"}

@app.post("/analyze", response_model=AnalysisResponse)
async def start_analysis(request: AnalysisRequest):
    target_url = request.url
    
    # Simple validation
    if not target_url.startswith("http"):
        target_url = "https://" + target_url
    
    job_id = str(uuid.uuid4())
    print(f"🚀 Starting analysis for job {job_id}: {target_url}")

    try:
        # 1. Trigger the Sandbox Agent
        # Note: This is synchronous for now. In production, use BackgroundTasks.
        agent_results = analyze_url(target_url)

        if not agent_results:
            raise HTTPException(status_code=500, detail="Agent failed to process the URL")

        # 2. Prepare the final structure
        # (This is where you'll eventually call risk_engine.py and Gemini)
        response_data = {
            "job_id": job_id,
            "status": "success",
            "target_url": agent_results["final_url"],
            "screenshot_url": agent_results["screenshot_path"],
            "result": {
                "risk_score": 0,  # Placeholder for Risk Engine
                "privacy_score": 0, # Placeholder for Risk Engine
                "label": "Pending",
                "explanation": "Agent scan completed. Risk analysis pending.",
                "flags": [],
                "technical_details": {
                    "redirects": agent_results["redirects"],
                    "scripts_found": len(agent_results["scripts"]),
                    "html_ref": agent_results["html_file_ref"]
                }
            }
        }

        # 3. Cache the output (mimicking your current job_output.json behavior)
        with open(f"job_{job_id}.json", "w") as f:
            json.dump(response_data, f, indent=4)

        return response_data

    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn main:app --reload