from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Instrutor

# Adiciona os campos novos (cref, telefone) na visualização do painel admin
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    list_display = ('email', 'nome_completo', 'cref', 'telefone', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo',)}),
        ('Informações Profissionais', {'fields': ('cref', 'telefone')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome_completo', 'cref', 'telefone', 'password'),
        }),
    )

admin.site.register(Instrutor, CustomUserAdmin)