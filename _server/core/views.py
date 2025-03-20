from django.shortcuts import render
from django.conf  import settings
import json
import os
import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import GroceryList, Item
import google.generativeai as genai
from django.views.decorators.csrf import csrf_exempt



# Load manifest when server launches
MANIFEST = {}

if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def create_list(req):
    body =  json.loads(req.body)
    # TODO validate data
    grocery_list = GroceryList(
        name=body["name"],
        user=req.user
    )
    grocery_list.save()
    for item_name in body["items"]:
        item = Item(
            grocery_list=grocery_list,
            name=item_name,
            purchased=False
        )
        item.save()
    return JsonResponse({"success": True})

# Load the API Key


@csrf_exempt
def ai_chat(request):
    # Explicitly handle OPTIONS
    if request.method == "OPTIONS":
        response = JsonResponse({"detail": "OK"})
        response["Access-Control-Allow-Origin"] = "*" # Or use *
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_query = data.get("query", "")
            
            if not user_query:
                return JsonResponse({"error": "Query is required"}, status=400)

            instructions = """
               You are Ori, a compassionate and supportive AI assistant/therapist.
                Respond with empathy and encouragement. Use a calm and supportive tone. 
                Keep responses clear, concise, and easy to understand. 
                Provide helpful insights, coping strategies, or reflective questions when appropriate. 
                Avoid making medical diagnoses or prescribing treatments. 
                Ensure responses promote emotional well-being and mental resilience.
            """

            prompt = f"""
            {instructions}
            
            User Query: {user_query}
            """

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            
            return JsonResponse({"response": response.text})
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)



# def test_gemini_api(req):
#     # Ensure the view only handles POST requests
#     data = json.loads(req.body)
#     # Parse the incoming JSON payload

#     prompt = data.get("prompt")
#     if not prompt:
#         return JsonResponse({"error": "A 'prompt' field is required."}, status=400)

#     # Use the officially documented endpoint for Google Gemini

#     # Construct the payload per the official API documentation
#     payload = {
#         "prompt": prompt,
#         # Include any additional parameters as required by the Gemini API
#     }

#     try:
#         # Use the requests library to perform an HTTP POST request
#         response = req.post(url, headers=headers, json=payload)
#         response.raise_for_status()  # Raise an error for non-2xx responses
#         return JsonResponse(response.json())
#     except req.HTTPError as http_err:
#         return JsonResponse({
#             "error": f"HTTP error occurred: {http_err}",
#             "status_code": response.status_code,
#             "response": response.text
#         }, status=response.status_code)
#     except Exception as e:
#         return JsonResponse({"error": f"Error generating response: {e}"}, status=500)
    
    