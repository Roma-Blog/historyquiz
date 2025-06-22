from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import CategoryQuestions, TopicQuestion
from django.contrib import messages
import json



@login_required
def home(request):

    topics = TopicQuestion.objects.prefetch_related('topic').all()

    category_questions = CategoryQuestions.objects.all()

    return render(request, 'historyquiz/index.html', { 'topics': topics})

@login_required
def questions_list(request, slug):
    category = get_object_or_404(CategoryQuestions, slug=slug)
    questions = category.questions.all()

    return render(request, 'historyquiz/questions_list.html', {"category": category, "questions": questions})

@login_required
def page_user (request):

    return render(request, 'historyquiz/user_page.html')

def stat (request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            print(data)

            return JsonResponse({'status': 'success', 'data': data}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)
    

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Неверное имя пользователя или пароль.')
    return render(request, 'historyquiz/login.html')


def logout_view(request):
    logout(request)
    return redirect('login')
