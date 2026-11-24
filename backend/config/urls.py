"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# Importa o painel administrativo nativo do Django
from django.contrib import admin

# 'path' cria uma rota individual e 'include' permite acoplar rotas de outros apps
from django.urls import path, include
from config.chat_view import chat_view

# Lista principal que o Django consulta para saber todas as rotas do sistema
urlpatterns = [
    # Rota para acessar o painel administrativo: http://localhost:8000/admin/
    path('admin/', admin.site.urls),

    # Qualquer rota iniciada com 'accounts/' é repassada para o arquivo backend/accounts/urls.py
    path('accounts/', include('accounts.urls')),

    # Endpoint do assistente virtual Léo
    path('api/chat', chat_view, name='chat_view_no_slash'),
    path('api/chat/', chat_view, name='chat_view'),
]

