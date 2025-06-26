from django.db import models
from django.contrib.auth.models import User


class TopicQuestion(models.Model):
    name = models.CharField(max_length=256, verbose_name='Название категории')
    slug = models.SlugField(max_length=320, unique=True, verbose_name='Слаг (URL)')

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'
        ordering = ['name']

    def __str__(self):
        return self.name

class CategoryQuestions(models.Model):
    topic = models.ForeignKey(TopicQuestion, on_delete=models.CASCADE, related_name='topic', null=True)
    name = models.CharField(max_length=256, verbose_name='Название категории')
    slug = models.SlugField(max_length=320, unique=True, verbose_name='Слаг (URL)')

    class Meta:
        verbose_name = 'Категория вопроса'
        verbose_name_plural = 'Категории вопросов'
        ordering = ['name']

    def __str__(self):
        return self.name
    
#_____________

class AnswerType(models.TextChoices):
    ANSWER_OPTION = 'answer_options', 'Варианты ответов'
    TYPED_ANSWER = 'typed_answer', 'Напечатанный ответ'

#_____________
    
class Question(models.Model):

    text = models.TextField()
    category = models.ForeignKey(CategoryQuestions, on_delete=models.CASCADE, related_name='questions')
    image = models.ImageField(upload_to='questions_images/', blank=True, null=True)

    #_____________
    answer_type = models.CharField(max_length=32, choices=AnswerType.choices, default=AnswerType.ANSWER_OPTION)
    #___________

    created_at = models.DateTimeField(auto_now_add=True)

    favorited_by = models.ManyToManyField(
        User,
        through='QuestionFavorites',
        related_name='favorite_questions'
    )

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'

    def __str__(self):
        return self.text
    
    def get_question_type(self):
        return self.category.topic

    def get_correct_answer(self):
        return self.answers.filter(is_correct=True).first()

    def get_incorrect_answers(self):
        return self.answers.filter(is_correct=False)
    

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=160)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuestionAnswerLog(models.Model):
    created_at = models.DateTimeField(auto_now_add=True) 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'question']),
        ]

    def __str__(self):
        return f"Statistics for {self.user.username} on question {self.question.id}"

class QuestionFavorites(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
