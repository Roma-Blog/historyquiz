from django.db import models
from django.contrib.auth.models import User

#Категории вопроса
class CategoryQuestions(models.Model):
    name = models.CharField(max_length=256)
    slug = models.CharField(max_length=320, unique=True)

    def __str__(self):
        return self.name
    
#Вопросы
class Question(models.Model):
    text = models.TextField()
    category = models.ForeignKey(CategoryQuestions, on_delete=models.CASCADE, related_name='questions')
    correct_answer = models.CharField(max_length=128)
    incorrect_answers = models.JSONField()
    image = models.ImageField(upload_to='questions_images/', blank=True, null=True)
    favorites = models.BooleanField(default=False)

    def __str__(self):
        return self.text

#Для сбора статистики по ответам на вопросы
class StatisticsOnIssues (models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    count_true_answer = models.IntegerField(default=0)
    count_false_answer = models.IntegerField(default=0)

    def __str__(self):
        return f"Statistics for {self.user.username} on question {self.question.id}"

