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
    "name": "Maria",
    "email": "maria@gmail.com",
    "birthDate": "1990/10/10",
    "password": "123456",
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
   "birthDate": "1990/10/10",
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




### ▪️ Editar Usuário
Nesta rota, o usuário precisa estar logado com o token no cabeçalho da requisição. Além disso, o usuário só poderá editar os seus próprios dados.

Nesse endpoint podemos atualizar dados do usuário, porém não deverá permitir que se atualize os campos **id, isAdm e isActive.**

> PATCH /users/:id - FORMATO DA REQUISIÇÃO

~~~JSON 
{
    "name": "Maria",
    "email": "maria@gmail.com",
    "birthDate": "1990/10/10",
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
    "birthDate": "1990/10/10",
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

> PATCH /users/:id - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "User Id must have a valid UUID format"
}
~~~


### ▪️ Deletar Usuário (Soft Delete)
Na api Cola&Bora a rota de deleção aplica um soft delete no usuário em questão.Essa rota apenas altera o campo <b>isActive</b> para <b>false</b>.

Nesta rota, o usuário precisa estar logado com o token no cabeçalho da requisição. Além disso, o usuário só poderá deletar a si mesmo.


> DELETE /users/:userId - FORMATO DA REQUISIÇÃO

~~~
Não é necessário um corpo da requisição.
~~~

Caso tudo dê certo, a resposta será assim:

> DELETE /users/:userId - FORMATO DA RESPOSTA - STATUS 204

~~~
A resposta não conterá nenhuma mensagem.
~~~

### ⚠️ Possíveis Erros

> DELETE /users/:userId - FORMATO DA RESPOSTA - STATUS 404

O usuário não foi encontrado: 
~~~JSON
{
  "message": "User not found"
}
~~~

> DELETE /users/:userId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "User Id must have a valid UUID format"
}
~~~

### ▪️ Cadastro de método de pagamento

> POST /users/payments - FORMATO DE REQUISIÇÃO

~~~JSON
{
  "number": "5593889718264334"
  "securityCode": "407"
  "dueDate": "2024/08/01"
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
  "dueDate": "2024/08/01"
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

~~~
Não é necessário um corpo da requisição.
~~~

Caso tudo dê certo, a resposta será assim:

>DELETE /users/payments - FORMATO DA RESPOSTA - STATUS 204

~~~
A resposta não conterá nenhuma mensagem.
~~~

## 🔹 **Rota de Doação**
### ▪️ Realizar uma doação

Nesta rota o Usuário precisa estar logado, e não precisa de autorização de admnistrador.

Esta rota é capaz de realizar uma doação para uma ong específica.

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

>  POST /donations/:ongId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


## 🔹 **Rota de Login**

### ▪️ Listar todas as categorias
Nesta rota o Usuário precisa não estar logado, e não precisa de autorização de admnistrador.
Independente de o usuário estar ativo ou não, essa rota automaticamente seta a chave **IsActive** para **true**.

> POST /login - FORMATO DA REQUISIÇÃO

~~~ JSON
{
    "email": "maria@gmail.com",
    "password": "123456"
}
~~~

Caso tudo dê certo, a resposta será assim:


> POST /login - FORMATO DA RESPOSTA - STATUS 200

~~~ JSON
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
	"cnpj": "11222333344445",
        "categoryId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
~~~

Caso tudo dê certo a resposta deverá ser assim:

> POST /ongs - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
	"data": {
		"id": "89ce3ca9-0903-434b-8695-ac8481ddebd0",
		"name": "nome da ong",
		"email": "ong@email.com",
		"tel": "9955996366",
		"description": "breve descrição da ong",
		"cpnj": "1122233334445",
		"balance": "0.00",
		"createdAt": "2022-11-03T15:50:50.382Z",
		"updatedAt": "2022-11-03T15:50:50.382Z",
		"category": {
			"id": "9f0ab13c-4d48-4f18-9be2-cab551d1e18b",
			"name": "Meio Ambiente"
		}
	}
}

~~~


### ⚠️ Possíveis Erros

> POST /ongs - FORMATO DA RESPOSTA - STATUS 400

Requisição enviada com campo obrigatório faltando: 
~~~JSON
{
  "message": "Required field is missing"
}
~~~


> POST /ongs - FORMATO DA RESPOSTA - STATUS 400

Requisição enviada por usuário que já possui uma ONG: 
```JSON
{
  "message": "User is alerady linked to a ONG"
}
```

> POST /ongs - FORMATO DA RESPOSTA - STATUS 404

Requisição enviada com id de categoria inexistente: 
```JSON
{
  "message": "Category does not exists in database"
}
```

> POST /ongs - FORMATO DA RESPOSTA - STATUS 400

Requisição enviada com propriedades já cadastradas no banco de dados: 
```JSON
{
  "message": "Email/Cnpj is already being used"
}
```

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
		"id": "3297e88c-45b4-46af-b8f7-ed500808ba0e",
		"name": "Prato amigo",
		"email": "ong@email.com",
		"tel": "9955996366",
		"description": "Levando comida pra quem mais precisa",
		"cpnj": "1122233334445",
		"balance": "0.00",
		"createdAt": "2022-11-03T17:14:41.892Z",
		"updatedAt": "2022-11-03T17:15:40.173Z",
		"category": {
			"id": "9f0ab13c-4d48-4f18-9be2-cab551d1e18b",
			"name": "Meio Ambiente"
		}
	}
}
~~~


### ⚠️ Possíveis Erros

> PATCH /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 404

A ONG não foi encontrada: 
~~~JSON
{
  "message": "ONG not found"
}
~~~

> PATCH /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 401

User não possui permissão de Admin para aquela ong: 
~~~JSON
{
  "message": "Unauthorized"
}
~~~

> PATCH /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


### ▪️ Deleção de Ong (Soft Delete)

Essa rota aplicará um soft delete na ONG em questão.
Essa rota apenas altera a chave <b>isActive</b> para <b>false</b>.
Para acessar essa rota o usuário deve estar logado e ter permissão de admin na ONG que irá ser "deletada". 

>DELETE /ongs/:ongId - FORMATO DA REQUISIÇÃO`

~~~
Não é necessário um corpo da requisição.
~~~

Se tudo der certo a resposta deverá ser:

>DELETE /ongs/:ongId - FORMATO DA RESPOSTA - STATUS 204


~~~
A resposta não conterá nenhuma mensagem.
~~~



### ▪️ Listar todas as ONGS

Essa rota não precisa de autenticação. A rota retorna todas as ONGs que estão cadastradas na da aplicação. Podemos acessar a rota da seguinte forma:

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
            "balance": 2090.80,
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

~~~JSON
{
    "data":    {
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
~~~


Caso seja um usuário com permissão de Admin para aquela ong, a resposta esperada deverá ser:

~~~JSON
{
    "data":    {
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
~~~



### ▪️ Listar usuários cadastrados no evento de uma ONG específica

Nesta rota o Usuário precisa estar logado, e é acessada apenas pelo administrador da ONG em questão.

> GET /ongs/:ongId/:eventId/users - FORMATO DE RESPOSTA - STATUS 200

~~~ JSON
    {
        "data": {
            {
               "id": "c110bcb6-beb9-4682-ab632c12a570066b",
               "name": "Maria",
               "email": "maria@gmail.com",
               "birthDate": "1990/10/10",
               "createdAt": "2020-11-27T00:01:13.789Z",
               "updatedAt": "2020-12-05T13:59:22.632Z",
               "isAdm": true
               "isActive": true
              },
              {
               "id": "c110dbb6-beb9-4682-ab632c12a570d66b",
               "name": "João",
               "email": "joao@gmail.com",
               "birthDate": "1990/10/10",
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

> GET /ongs/:ongId/:eventId/users - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

> GET /ongs/:ongId/:eventId/users - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~






---

## 🔹 **Rotas de Eventos**

### ▪️ Criação de Evento
Esta rota é acessada apenas pelo administrador da ONG em questão.
O horário do evento deverá subir em horário local, e entrará no banco de dados automaticamente em horário UTC(Padrão Global GMT+0)


> POST /ongs/events - FORMATO DA REQUISIÇÃO
~~~JSON
{
  "name": "Ação de Natal",
  "date": "December 24, 2022 14:00:00",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "address": {
    "street": "Rua Carolia Fernandes",
    "number": "980",
    "cep": "69400797",
    "extra": "casa"
   }
}
~~~

Caso tudo dê certo, a resposta será assim:

> POST /ongs/events - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
	"data": {
		"name": "Ação de Natal",
		"description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
		"date": "2022-12-24T18:00:00.000Z",
		"ong": {
			"id": "5d186775-fb9e-4612-9149-4d8e7aa6fc2c",
			"name": "Amigos da Natureza Pt.2",
			"email": "ong@email.com",
			"tel": "9955996366",
			"description": "breve descrição da ong",
			"cpnj": "11222333344445",
			"createdAt": "2022-11-04T13:39:28.962Z",
			"updatedAt": "2022-11-04T13:40:51.025Z"
		},
		"address": {
			"street": "Rua Carolia Fernandes",
			"number": "980",
			"cep": "69400797",
			"extra": "casa",
			"id": "8f647ab0-6b99-4a1c-b837-e9a7c95959a5"
		},
		"id": "3bf04ab3-7d2b-498b-a989-1f83c9c778b0"
	}
}
~~~


### ▪️ Editar um Evento

Esta rota é acessada apenas pelo administrador da ONG em questão.
O horário do evento deverá subir em horário local, e entrará no banco de dados automaticamente em horário UTC(Padrão Global GMT+0)

>PATCH ongs/events/:eventId - FORMATO DA REQUISIÇÃO

~~~JSON
{
  "name": "Ação de Natal - 2022",
  "date": "December 24, 2022 14:00:00",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "address": {
    "street": "Rua Carolia Fernandes",
    "number": "720",
    "cep": "69400797",
    "extra": "igreja"
   }
}
~~~

>PATCH ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
 "data": 
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal - 2022",
  "date": "2022-12-24T18:00:00.000Z",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~

### ⚠️ Possíveis Erros

O id do evento não for encontrado: 

>PATCH ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

>PATCH ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


### ▪️ Deletar um Evento

Esta rota é acessada apenas pelo administrador da ONG em questão.

>DELETE ongs/events/:eventId - FORMATO DA REQUISIÇÃO

~~~
Não é necessário um corpo da requisição.
~~~

>DELETE ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 204


~~~
A resposta não conterá nenhuma mensagem.
~~~



### ⚠️ Possíveis Erros

O id do evento não for encontrado: 

>DELETE ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

>DELETE ongs/events/:eventId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


### ▪️ Cadastrar usuário em um Evento

Esta rota precisa de autenticação.

>POST /events/:eventId - FORMATO DA REQUISIÇÃO

~~~
Não é necessário um corpo da requisição.
~~~

>POST /events/:eventId - FORMATO DA RESPOSTA - STATUS 201

~~~JSON
{
 "message": "User successfully registered on event."
}
~~~

### ⚠️ Possíveis Erros

O id do evento não for encontrado: 

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


### ▪️ Excluir a participação de usuário em um Evento

Esta rota só pode ser acessada pelo próprio usuário.

>DELETE /events/:eventId - FORMATO DA REQUISIÇÃO

~~~
Não é necessário um corpo da requisição.
~~~

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 204

~~~JSON
{
 "message": "User successfully deleted from event."
}
~~~

### ⚠️ Possíveis Erros

O id do evento não for encontrado: 

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

>DELETE /events/:eventId - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
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

### ▪️ Listar todos os Eventos de uma ONG específica

Esta rota não precisa de autenticação.

>GET /events/:ongId - FORMATO DA REQUISIÇÃO
~~~
Não é necessário um corpo da requisição.
~~~

>GET /events/:ongId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
    
{
 "data": 
 [
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "2022-12-24T18:00:00.000Z",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
    {
  "id": "dd720fc5-3cc9-410e-8e58-976c82f209c0",
  "name": "Ação de Ano Novo",
  "date": "2022-12-31T18:00:00.000Z",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Ano-Novo",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  },
  ]
}
~~~

### ⚠️ Possíveis Erros

O id da ONG não for encontrado: 

>GET /events/:ongId  - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "ONG not found"
}
~~~

>GET /events/:ongId  - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~

### ▪️ Listar um Evento específico

Esta rota não precisa de autenticação.

>GET /events/:eventId - FORMATO DA REQUISIÇÃO

Não é necessário um corpo da requisição.


>GET /events/:eventId - FORMATO DA RESPOSTA - STATUS 200

~~~JSON
{
 "data": 
  {
  "id": "c110dbb6-beb9-4682-ab63-2c12a570d66b",
  "name": "Ação de Natal",
  "date": "2022-12-24T18:00:00.000Z",
  "description": "Entrega de alimentos a famílias necessitadas na véspera do Natal",
  "ongId": "1940084e-163a-4594-99f5-239fdac540e5",
  "addressId": "dd720fc5-3cc9-410e-8e58-976c82f209c0"
  }
}
~~~

### ⚠️ Possíveis Erros

O id do evento não for encontrado: 

>GET /events/:eventId  - FORMATO DA RESPOSTA - STATUS 404
~~~JSON
{
  "message": "Event not found"
}
~~~

>GET /events/:eventId  - FORMATO DA RESPOSTA - STATUS 400

O id fornecido não é um UUID válido: 
~~~JSON
{
  "message": "Id must have a valid UUID format"
}
~~~


---
