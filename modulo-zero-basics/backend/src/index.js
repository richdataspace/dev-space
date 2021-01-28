

// Define um objeto express importando com o `require` o 'express':
const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4'); 

// Define um objeto app, que é uma chamada da função express;
const app = express();

app.use(cors());
app.use(express.json());


const projects = [];

// MiddleWare
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel =  `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); // tem que tirar o return

    console.timeEnd(logLabel);

}

function validateProjectId(request, response, next) {
    const { id } = request.params;
    if (!isUuid(id)) {
        return response.status(400).json({ error: `invalid project ID.`})
    }
    return next();
}


app.use(logRequests);
app.use(`/projects/:id`, validateProjectId)

// Com app instanciado, podemos acessar os atributos e métodos dele:
// Define a rota
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
    ? projects.filter(project => project.title.includes(title) )
    : projects;

    // // return response representa o que o back retornará para o front
    return response.json(results);
});

app.post('/projects', (request, response) => {
    // return response representa o que o back retornará para o front
    const {title, owner} = request.body

    const project = { id: uuid(), title, owner} ;

    projects.push(project)

    console.log(owner)
    console.log(title)

    return response.json(project) // sempre exibe o projeto recém criado, e nao toda lista.
});

app.put('/projects/:id', validateProjectId, (request, response) => {
    const { id } = request.params
    const {title, owner} = request.body

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0 ) {
        return response.status(400).json({"error": "Project not found"})
    }

    const project = {
        id, 
        title,
        owner
    }; 

    projects[projectIndex] = project;

    
    console.log(id)
    // return response representa o que o back retornará para o front
    return response.json(project)
});

app.delete('/projects/:id', validateProjectId, (request, response) => {
    const { id } = request.params

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0 ) {
        return response.status(400).json({"error": "Project not found"})
    }

    projects.splice(projectIndex, 1);

    // return response representa o que o back retornará para o front
    return response.status(204).send()
});

// http://localhost:3333/projects/2


app.listen(3333, () => {
    console.log(`😘 Back-end Started!`)
});