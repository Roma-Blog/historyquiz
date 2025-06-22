from django.contrib import admin
from .models import Question, CategoryQuestions, Answer, TopicQuestion


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 3  
    fields = ('text', 'is_correct')
    readonly_fields = ()
    max_num = 10

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('text',)
    inlines = [AnswerInline]

admin.site.register(Question, QuestionAdmin)
admin.site.register(CategoryQuestions)
admin.site.register(TopicQuestion)