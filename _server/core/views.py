from django.shortcuts import render
from django.conf  import settings
import json
import os
import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import SessionList, Item
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
def my_session_lists(request):
    # Get all session lists belonging to the user
    session_lists = SessionList.objects.filter(user=request.user)
    data = []
    for session in session_lists:
        # Optionally include associated items, if needed
        items = list(session.item_set.values('id', 'name'))
        data.append({
            'id': session.id,
            'name': session.name,
            'items': items,
        })
    return JsonResponse({'session_lists': data})


@login_required
def create_session_list(req):
    body = json.loads(req.body)
    # TODO: Add data validation here
    session_list = SessionList(
        name=body["name"],
        user=req.user
    )
    session_list.save()
    for item_name in body["items"]:
        item = Item(
            session_list=session_list,
            name=item_name,
        )
        item.save()
    return JsonResponse({"success": True})


@login_required
def delete_session_list(request, id):
    if request.method == "DELETE":
        try:
            session = SessionList.objects.get(id=id, user=request.user)
        except SessionList.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Session not found'}, status=404)
        session.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)



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
    