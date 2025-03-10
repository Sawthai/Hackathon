from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import GroceryList, Item

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