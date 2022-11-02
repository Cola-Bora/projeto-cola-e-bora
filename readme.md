# Projeto API Cola&Bora 🤝♻️🐶

#### Cola&Bora é um projeto criado com o intuito de conectar pessoas a ONGs e ações sociais, permitindo que usuários se inscrevam, participem de eventos e façam doações a ONGs com as quais se identifiquem!


### Endpoints:
<b>URL base da API: http://teste.com</b>

---

## 🔹 **Rotas de Usuário**
### ▪️ Criação de Usuário
Para a rota de criação de usuário, não é preciso estar logado na aplicação.

> POST /users - FORMATO DA REQUISIÇÃO

~~~JSON
{
  "data": 
  {
    "name": "Maria",
    "email": "maria@gmail.com",
    "idade": 23,
    "password": "123456",
    "isAdm": true
  }
}
~~~

Caso tudo dê certo, a resposta será assim:

> POST /users - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
  "data": 
  {
   "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
   "name": "Maria",
   "email": "maria@gmail.com",
   "idade": 23,
   "createdAt": "2020-11-27T00:01:13.789Z",
   "updatedAt": "2020-12-05T13:59:22.632Z",
   "isAdm": true,
   "isActive": true
  }
}
~~~

### ⚠️ Possíveis Erros

> POST /users - FORMATO DA RESPOSTA - STATUS 400

Caso você esqueça de enviar algum campo, a resposta de erro será assim: 

~~~JSON
{
  "message": "Required field is missing"
}
~~~

Email já cadastrado:

> POST /users - FORMATO DA RESPOSTA - STATUS 400

~~~JSON
{
  "message": "This email is already registered"
}
~~~

### ▪️ Listar todos os Usuários

Nesta rota o Usuário precisa estar logado com o token no cabeçalho da requisição, mas não precisa de autorização de admnistrador. 

Caso tudo dê certo, a resposta será assim:

> GET /users - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
  "data": [
      {
       "id": "c110dbb6-beb9-4682-ab632c12a570d66b",
       "name": "Maria",
       "email": "maria@gmail.com",
       "idade": 23,
       "createdAt": "2020-11-27T00:01:13.789Z",
       "updatedAt": "2020-12-05T13:59:22.632Z",
       "isAdm": true
       "isActive": true
      },
  ]
}
~~~

### ▪️ Editar Usuário
Nesta rota, o usuário precisa estar logado com o token no cabeçalho da requisição. Além disso, o usuário só poderá editar os seus próprios dados.

Nesse endpoint podemos atualizar dados do usuário, porém não é atualizar os campos **id, isAdm e isActive.**

> PATCH /users/:id - FORMATO DA REQUISIÇÃO

~~~JSON 
{
    "name": "Maria",
    "email": "maria@gmail.com",
    "idade": 23,
    "password": "123456",
}
~~~

Caso tudo dê certo, a resposta será assim:

> PATCH /users/:id - FORMATO DA RESPOSTA - STATUS 200

~~~JSON 
{
    "data": 
 {
    "name": "Maria Costa",
    "email": "maria@gmail.com",
    "idade": 25,
    "password": "123456",
 }
}
~~~

### ⚠️ Possíveis Erros

> PATCH /users/:id - FORMATO DA RESPOSTA - STATUS 404

O usuário não foi encontrado: 
~~~JSON
{
  "message": "User not found"
}
~~~

### ▪️ Deletar Usuário (Soft Delete)
Na api Cola&Bora a rota de deleção aplica um soft delete no usuário em questão.Essa rota apenas altera o campo <b>isActive</b> para <b>false</b>.

Nesta rota, o usuário precisa estar logado com o token no cabeçalho da requisição.

> DELETE /users/:id - FORMATO DA REQUISIÇÃO

~~~
Não é necessário um corpo da requisição.
~~~
Caso tudo dê certo, a resposta será assim:

> DELETE /users/:id - FORMATO DA RESPOSTA - STATUS 204

~~~JSON 
{
 "message": "User successfully deleted."
}
~~~

### ⚠️ Possíveis Erros

> DELETE /users/:id - FORMATO DA RESPOSTA - STATUS 404

O usuário não foi encontrado: 
~~~JSON
{
  "message": "User not found"
}
~~~

### ▪️ Cadastro de método de pagamento

> POST /users/payments - FORMATO DE REQUISIÇÃO

~~~JSON
{
  "number": "5593889718264334"
  "securityCode": "407"
  "dueDate": "2024-08-01"
}
~~~
Caso tudo dê certo, a resposta será assim:

> POST /users/payments - FORMATO DE RESPOSTS - STATUS 201

~~~JSON
{
  "message" : "Credit card successfully created"
}
~~~

### ⚠️ Possíveis Erros

> POST /users/payments - FORMATO DA RESPOSTA - STATUS 404

O usuário já tem um cartão de crédito cadastrado: 
~~~JSON
{
  "message": "User already has a credit card registered"
}
~~~

Caso você esqueça de enviar algum campo, a resposta de erro será assim:

~~~JSON
{
  "message": "Required field is missing"
}
~~~


### ▪️ Editar método de pagamento

> PATCH /users/payments - FORMATO DE REQUISIÇÃO

~~~JSON
{
  "number": "5593889718264334"
  "securityCode": "407"
  "dueDate": "2024-08-01"
}
~~~
Caso tudo dê certo, a resposta será assim:

> PATCH /users/payments - FORMATO DE RESPOSTA - STATUS 200

~~~JSON
{
  "message" : "Payment method successfully edited"
}
~~~

### ⚠️ Possíveis Erros
Usuário tentou enviar um campo vazio: 

> PATCH /users/payments - FORMATO DE RESPOSTA - STATUS 400

~~~JSON
{
  "message": "Required field is missing"
}
~~~

### ▪️ Deletar método de pagamento

>DELETE /users/payments - FORMATO DA REQUISIÇÃO`

Não é necessário um corpo da requisição.

Caso tudo dê certo, a resposta será assim:

>DELETE /users/payments - FORMATO DA RESPOSTA - STATUS 204

~~~JSON
{
 "message": "Payment method successfully deleted."
}
~~~


## 🔹 **Rota de Doação**
### ▪️ Realizar uma doação

Nesta rota o Usuário precisa não estar logado, e não precisa de autorização de admnistrador.

Esta rota é capaz de ralizar uma doação para uma ong específica.

> POST /donations/:ongId - FORMATO DE REQUISIÇÃO

~~~JSON
{
 "value" : 200.00
}
~~~

> POST /donations/:ongId - FORMATO DE RESPOSTA - 201

~~~JSON
{
 "message" : "successfully received donation"
}
~~~

### ⚠️ Possíveis Erros

> POST /donations/:ongId - FORMATO DE RESPOSTA - STATUS 404

O ONG não foi encontrada: 
~~~JSON
{
  "message": "ONG not found"
}
~~~


## 🔹 **Rota de Login**

### ▪️ Listar todas as categorias
Nesta rota o Usuário precisa não estar logado, e não precisa de autorização de admnistrador.

> POST /login - FORMATO DA REQUISIÇÃO

~~~ JASON
{
    "email": "maria@gmail.com",
    "password": "123456",
}
~~~

Caso tudo dê certo, a resposta será assim:


> POST /login - FORMATO DA RESPOSTA - STATUS 200

~~~ JASON
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY2NzMyMDI3MiwiaWF0IjoxNjY3MzIwMjcyfQ.0TENJ1RYnO8jZYYMzteFIixIPsJXYGH_02yVbnA4xDw"
}

~~~

### ⚠️ Possíveis Erros

> POST /login - FORMATO DA RESPOSTA - STATUS 404

O usuário não foi encontrado: 
~~~JSON
{
  "message": "Invalid Email or password"
}
~~~

## 🔹 **Rotas de Categorias**
### ▪️ Listar todas as categorias 

Nesta rota o Usuário precisa estar logado, mas não precisa de autorização de admnistrador.

Esta rota retorna todas as categorias que estão cadastradas e ativas dentro da aplicação, podemos acessar a rota da seguinte forma:

Caso tudo dê certo, a resposta será assim:

> GET /categories - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
  "data": [
      {
       "id": "a102e8ba-17e4-4bc6-84fe-23dbe737984c",
       "name": "Educação"
      },
      {
       "id": "46b4a302-6564-4a2b-8fa6-370af9aec029",
       "name": "Meio Ambiente"
      },
  ]
}
~~~

---

## 🔹 **Rotas de Ongs**
### ▪️ Criação de Ong

Para criação de uma ong o usuário deve estar cadastrado e logado.

>POST /ongs - FORMATO DA REQUISIÇÃO

~~~JSON
  {
	"name": "nome da ong",
	"email": "ong@email.com",
	"tel": "9955996366",
	"description": "breve descrição da ong",
	"cnpj": "00000000000000"
  }
~~~

Caso tudo dê certo a resposta deverá ser assim:

> POST /ongs - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
  {
    "data": {
        "id": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
        "name": "nome da ong",
        "email": "ong@email.com",
        "tel": "9955996366",
        "description": "breve descrição da ong",
        "cnpj": "11222333444455",
        "createdAt": "Sat Dez 24 2022 14:00:00 GMT-0400",
        "updatedAt": "Sat Dez 24 2022 14:00:00 GMT-0400",
        "userAdmId": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
        "categoryId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
        }
  }

~~~


### ⚠️ Possíveis Erros

> POST /ongs - FORMATO DA RESPOSTA - STATUS 400

Requisição enviada com campo obrigatório faltando: 
~~~JSON
{
  "message": "User not found"
}
~~~


### ▪️ Editar Ong

Para editar uma ong o usuário deverá estar logado e ter permissão de adm para aquela ong.

>PATCH /ongs/:ongId - FORMATO DA REQUISIÇÃO

~~~JSON
  {

    "name": "Amigos do Peito",
    "email": "amigosdopeito@email.com",
    "tel": "21966356685",
    "description": "Levando comida a quem mais precisa",
    "cnpj": "11222333444455"
  }

~~~

Em caso de sucesso a resposta deverá ser assim

>PATCH /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
  {
   "data": {
	"name": "Amigos do Peito",
	"email": "ong@email.com",
	"tel": "21966356685",
	"description": "Levando comida a quem mais precisa",
	"cnpj": "11222333444455",
	"createdAt": "Sat Dez 24 2022 14:00:00 GMT-0400",
	"updatedAt": "Sat Dez 25 2022 14:00:00 GMT-0400",
	"userAdmId": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
	"categoryId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~


### ⚠️ Possíveis Erros

> PATCH /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 404

A ONG não foi encontrada: 
~~~JSON
{
  "message": "Invalid ONG Id"
}
~~~


### ▪️ Deleção de Ong (Soft Delete)

Essa rota aplicará um soft delete na ONG em questão.
Essa rota apenas altera a chave <b>isActive</b> para <b>false</b>.
Para acessar essa rota o usuário deve estar logado e ter permissão de admin na ONG que irá ser "deletada". 

>DELETE /ongs/:ongId - FORMATO DA REQUISIÇÃO`

Não é necessário um corpo da requisição.

Se tudo der certo a resposta deverá ser:

>DELETE /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 204

~~~JSON
{
 "message": "ONG successfully soft-deleted."
}
~~~



### ▪️ Listar todas as ONGS

Nesta rota o Usuário precisa estar logado, mas não precisa de autorização de admnistrador.

O campo <b>balance</b> não retorna na tela.

Esta rota retorna todas as ONGs que estão cadastradas e ativas dentro da aplicação, podemos acessar a rota da seguinte forma:

> GET /ongs - FORMATO DE RESPOSTA - STATUS 200

~~~JSON
{
    "data": [
        {
            "id": "aefae9d9-3424-4bd4-b591-193f8f28916a",
            "name": "Abrigo Moacyr ALVES - AMA",
            "tel": "92996227704",
            "email": "abrigomoacyr@mail.com"
            "description": "Propiciar condições, por meio de atitudes e comportamentos, para que as crianças e adolescentes, juntamente com os funcionários, voluntários, estagiários e visitantes, sintam o abrigo como uma grande família.",
            "cnpj": "25746767000195"
            "createdAt": "2020-11-27T00:01:13.789Z",
            "updatedAt": "2020-12-05T13:59:22.632Z",
            "userAdm": {
                "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
                "name": "Maria",
                "email": "maria@gmail.com",
                "idade": 23,
                "createdAt": "2020-11-27T00:01:13.789Z",
                "updatedAt": "2020-12-05T13:59:22.632Z",
                "isAdm": true
                "isActive": true
            }
            "category" {
                "id": "f9989bfe-03e0-4d97-b0a1-0637e8615fe6",
                "name": "Acolhimento Institucional"
            }
        } ,
    ]
}
~~~

### ▪️ Listar Ong Específica


> GET /ongs/:ongId - FORMATO DA REQUISIÇÃO


Há dois tipos de respostas para essa requisição.
Caso seja um usuário comum autenticado deverá retornar:

```JSON
    [
        {
            "data":{
                "id": "aefae9d9-3424-4bd4-b591-193f8f28916a",
                "name": "Abrigo Moacyr ALVES - AMA",
                "tel": "92996227704",
                "email": "abrigomoacyr@mail.com",
                "description": "Propiciar condições, por meio de atitudes e comportamentos...",
                "cnpj": "25746767000195",
                "createdAt": "2020-11-27T00:01:13.789Z",
                "updatedAt": "2020-12-05T13:59:22.632Z",
                "category": {
                    "id": "f9989bfe-03e0-4d97-b0a1-0637e8615fe6",
                    "name": "Acolhimento Institucional"
                }
            }
        },
    ]
```


Caso seja um usuário com permissão de Admin para aquela ong, a resposta esperada deverá ser:

```JSON
    [
        {
            "data":{
                "id": "aefae9d9-3424-4bd4-b591-193f8f28916a",
                "name": "Abrigo Moacyr ALVES - AMA",
                "tel": "92996227704",
                "email": "abrigomoacyr@mail.com",
                "description": "Propiciar condições, por meio de atitudes e comportamentos...",
                "cnpj": "25746767000195",
                "createdAt": "2020-11-27T00:01:13.789Z",
                "updatedAt": "2020-12-05T13:59:22.632Z",
                "balance": 2090.80,
                "category": {
                    "id": "f9989bfe-03e0-4d97-b0a1-0637e8615fe6",
                    "name": "Acolhimento Institucional"
                }
            }
        },
    ]
```


### ▪️ Listar usuários cadastrados no evento de uma ong específica

Nesta rota o Usuário precisa estar logado, e é acessada apenas pelo administrador da ONG em questão.

> GET /ongs/events/users - FORMATO DE RESPOSTA - STATUS 200

~~~ JSON
    {
        "data": {
            {
               "id": "c110bcb6-beb9-4682-ab632c12a570066b",
               "name": "Maria",
               "email": "maria@gmail.com",
               "idade": 23,
               "createdAt": "2020-11-27T00:01:13.789Z",
               "updatedAt": "2020-12-05T13:59:22.632Z",
               "isAdm": true
               "isActive": true
              },
              {
               "id": "c110dbb6-beb9-4682-ab632c12a570d66b",
               "name": "João",
               "email": "joao@gmail.com",
               "idade": 25,
               "createdAt": "2020-11-27T00:01:13.789Z",
               "updatedAt": "2020-12-05T13:59:22.632Z",
               "isAdm": false
               "isActive": true
              },
        }
    }
~~~

### ⚠️ Possíveis Erros

O id do evento não for encontrado: 
~~~JSON
{
  "message": "Invalid eventId"
}
~~~

### ▪️ Criação de Evento
Esta rota é acessada apenas pelo administrador da ONG em questão.
> POST /ongs/events - FORMATO DA REQUISIÇÃO
~~~JSON
{
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
}
~~~

Caso tudo dê certo, a resposta será assim:

> POST /ongs/events - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
 "data": 
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~


### ▪️ Editar um Evento

Esta rota é acessada apenas pelo administrador da ONG em questão.

>PATCH ongs/events/:eventId - FORMATO DA REQUISIÇÃO

~~~JSON
{
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal - 2022",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
}
~~~

>PATCH ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
 "data": 
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal - 2022",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~


### ▪️ Deletar um Evento

Esta rota é acessada apenas pelo administrador da ONG em questão.

>DELETE ongs/events/:eventId - FORMATO DA REQUISIÇÃO

Não é necessário um corpo da requisição.


>DELETE ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 204

~~~JSON
{
 "message": "Event successfully deleted."
}
~~~

---

## 🔹 **Rotas de Eventos**

### ▪️ Cadastrar usuário em um Evento

Esta rota precisa de autenticação.

>POST /events/:eventId - FORMATO DA REQUISIÇÃO

~~~JSON
{
  "userId": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "eventId": "342b1254-6738-47a0-b454-89f831c6cac3",
}
~~~

>POST /events/:eventId - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
 "message": "User successfully registered on event."
}
~~~

### ▪️ Excluir a participação de usuário em um Evento

Esta rota só pode ser acessada pelo próprio usuário ou pelo administrador da ONG em questão.

>DELETE /events/:eventId - FORMATO DA REQUISIÇÃO

Não é necessário um corpo da requisição.

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 204

~~~JSON
{
 "message": "User successfully deleted from event."
}
~~~


### ▪️ Listar todos os Eventos

Esta rota não precisa de autenticação.

>GET /events - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
 "data": 
 [
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
    {
  "id": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
  "name": "Ação de Ano Novo",
  "date": "Sat Dez 31 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Ano-Novo",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
  ]
}
~~~

### ▪️ Listar Eventos de um Usuário
Nesta rota o Usuário precisa estar logado com o token no cabeçalho da requisição. 

> GET /events/:userId - FORMATO DA REQUISIÇÃO

Não é necessário um corpo da requisição.

> GET /events/:userId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
  "data":
  [
 {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
},

{
  "id": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
  "name": "Ação de Ano Novo",
  "date": "Sat Dez 31 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Ano-Novo",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
},
  ]
}
~~~


### ▪️ Listar todos os Eventos de uma ONG específica

Esta rota não precisa de autenticação.

>GET /events/:ongId - FORMATO DA REQUISIÇÃO

Não é necessário um corpo da requisição.


>GET /events/:ongId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
    
{
 "data": 
 [
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
    {
  "id": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
  "name": "Ação de Ano Novo",
  "date": "Sat Dez 31 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Ano-Novo",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
  ]
}
~~~

### ▪️ Listar um Evento específico

Esta rota não precisa de autenticação.

>GET /events/:id - FORMATO DA REQUISIÇÃO
Não é necessário um corpo da requisição.

>GET /events/:id - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
 "data": 
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "Sat Dez 24 2022 14:00:00 GMT-0400",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~



---
