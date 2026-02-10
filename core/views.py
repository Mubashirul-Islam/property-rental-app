from django.shortcuts import render


def home(request):
	return render(request, "home.html")


def property_list(request):
	return render(request, "property_list.html")


def property_detail(request, property_id):
	return render(request, "property_detail.html", {"property_id": property_id})