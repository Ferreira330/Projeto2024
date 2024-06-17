# Relatório
___
## Introdução

Para a cadeira de Engenharia Web foi-nos proposta a realização de um trabalho, e dos vários temas fornecidos escolhemos o "Ruas de Braga". Assim, ficamos encarregues de desenvolver um sistema que seja capaz de armazenar, consultar e gerir recursos relativamente às ruas da cidade de Braga e suas respetivas casas. Para além disso, implementar também uma diferenciação entre utilizadores, cada um com diferentes permissões.
___

## API De Dados
Para definir a API de dados tivemos que inicialmente analizar e tratar o *dataset* que nos foi fornecido, e posteriormente definir o modelo da Base de Dados e da API.

### 1. Análise e tratamento do Dataset
Começamos por analisar o ficheiro *.xls* referente às ruas, que explica como estão definidos os ficheiros *.xml* de cada rua, imaginando como seria a base de dados e como poderíamos tratá-los para os importar para a base de dados.

Para tratar de todos os ficheiros foram usados os seguintes módulos em python:

- [json](https://docs.python.org/3/library/json.html) - utilizado para guardar os *dicionários* em json;
- [ltree](https://docs.python.org/3/library/xml.etree.elementtree.html) - utilizado para ler a informação contida dentro dos ficheiros *.xml*;
- [re](https://docs.python.org/3/library/re.html) - utilizado para tratar erros(?) no *.xml*;
- [os](https://docs.python.org/3/library/os.html) - utilizado para listar os ficheiros que necessitam de ser processados.

### 2. Definição do Modelo da BD e da API
Para a definição do modelo da Base de Dados e da API, começamos por analisar o *dataset* e perceber como poderíamos organizar a informação. Assim, modelar a base de dados da seguinte forma:

```js
const figuraSchema = new Schema({
    id: String,
    imagem: String,
    legenda: String,
});

const casaSchema = new Schema({
    numero: String,
    enfiteuta: String,
    foro: String,
    desc: String,
});

const ruaSchema = new Schema({
    _id: Number,
    nome: String,
    figuras: [figuraSchema],
    para: [String],
    casas: [casaSchema],
    lugares: [String],
    datas: [String],
    entidades: [String],
});
```

Para a API, definimos as seguintes rotas:

- GET /braga/ - Retorna todas as ruas
- GET /braga/:id - Retorna a rua com o id especificado
- POST /braga/ - Adiciona uma nova rua
- PUT /braga/:id - Atualiza a rua com o id especificado
- DELETE /braga/:id - Elimina a rua com o id especificado
- GET /braga/:id/remove-image/:folder/:image - Elimina a imagem especificada da rua com o id especificado
- GET /braga/NewID - Retorna o próximo ID disponível para uma nova rua
- GET /braga/lugares - Retorna todos os lugares listados nas ruas
- GET /braga/entidades - Retorna todas as entidades listadas nas ruas
- GET /braga/datas - Retorna todas as datas listadas nas ruas

## Funcionalidades da Plataforma

### Inserção de Novas Ruas

Para permitir a inserção de novas ruas, implementamos um formulário que permite ao utilizador adicionar uma nova rua, com todas as informações necessárias.

### Edição de Ruas

Para permitir a edição de ruas, implementamos um formulário que permite ao utilizador editar uma rua, com todas as informações necessárias. Isto também inclui a adição e remoção de casas e figuras.

### Upload de Imagens

De forma a permitir um maior contributo dos utilizadores, permitimos a adição de imagens às ruas, e a visualização das mesmas na página respetiva.

### Pesquisa de Ruas

Para facilitar a pesquisa de ruas, implementamos um sistema de pesquisa que permite ao utilizador pesquisar por lugar, entidade ou data, escolhendo-os de uma lista pré-definida.

## Autenticação

Esta camada é a principal responsável por todas as questões relacionadas ao registo e autenticação dos diversos utilizadores da plataforma. Recorremos à utilização do *jsonwebtoken* e do *passport* para a realização da autenticação de forma segura, usando depois esse token para obter os dados da API. A interface tem as rotas protegidas, como adicionar/editar ruas ou casas, em que é necessário o usuário estar autenticado para realizar estas ações. Também existem certos elementos da interface que só são visíveis para os administradores, como a opção de adicionar novas ruas. Ao registar-se, é possível escolher o nível de acesso, sendo que os administradores têm acesso a todas as funcionalidades da plataforma.

Cada utilizador tem um nível de acesso(Utilizador ou Admin), sendo que as ações de gestão das ruas são exclusivas aos Admins.


___

## Conclusão
Chegando ao fim do nosso trabalho pensamos ter conseguido aplicar todos os conhecimentos ganhos ao longo do semestre nesta Unidade Curricular. Pensamos ter atingido todos os objetivos propostos.