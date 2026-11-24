# importa o models, utilizado para criar modelos que representa o banco de dados
from django.db import models

# Create your models here.

# importa o  AbstractUser que oferece a estrutura padrão de um usuario, pode personalizar
from django.contrib.auth.models import AbstractUser

# modulo que importa a classe RegexValidator que valida um texto comparando ele 
# com uma expressão regular 
from django.core.validators import RegexValidator


# cria uma variavel que sera um objeto RegexValidator, configura quais textos serão aceitos
validar_cref = RegexValidator(
    # parâmetro que define o padrão que o texto precisa obedecer. 
    regex=r'^CREF \d{6}-[GP]/(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$',
    message='Informe um CREF válido. Exemplo: CREF 005405-G/AL'
)

class Instrutor(AbstractUser):
    """
    Modelo de Usuário personalizado para o FitManager.
    Já herda nativamente: username, first_name, last_name, email, password, etc.
    """

    username = None
    first_name = None
    last_name = None

    nome_completo = models.CharField(
        max_length=150,
        verbose_name="Nome completo"
    )
    # Campos específicos para os personais / usuários do sistema
    cref = models.CharField(
        max_length=20, 
        unique=True, 
        null=True, #permite que o campo de banco de dados fique vazio (alterar quando lançar)
        blank=True, #permite que o campo fique vazio (alterar quando lançar)
        verbose_name="CREF",
        validators=[validar_cref]
    )
    telefone = models.CharField(
        max_length=20, 
        blank=False, #permite que o campo fique vazio
        null=False, #permite que o campo de banco de dados fique vazio
        verbose_name="Telefone"
    )

    data_cadastro = models.DateTimeField(
        auto_now_add=True
    )

    email = models.EmailField(
    unique=True,
    verbose_name="Email"
    )

    USERNAME_FIELD = 'email' # utilizar o email como identificador de login e não username

    REQUIRED_FIELDS = ['nome_completo']

    # Esse trecho define como o objeto Instrutor será representado como texto quando
    # precisar exibi-lo.
    def __str__(self):
        # Exibe o nome completo ou o username no admin
        return self.get_full_name() or self.username