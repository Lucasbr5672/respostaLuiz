/** Estrutura de dados
 * {
 * nome: ''
 * autor: ''
 * genero: ''
 * anoPublicacao: ''
 * personagens: [personagem1, 2, 3, 4]
 * }
 */
import http, { request } from 'node:http'
import fs from 'node:fs'

const PORT = 3333

const server = http.createServer((request, response)=>{
    const {method, url} = request

    if(method === "GET" && url === "/livros"){
        fs.readFile('livros.json', 'utf8', (err, data)=>{
            if(err){
                response.writeHead(500, {"Content-Type": "application/json"});
                response.end(JSON.stringify({message: "Não foi possivel ler o arquivo" }));
                return;
            }
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(data));
        });
    } else if(method === "POST" && url === "/livros"){
        let body = ''
        request.on('data', (chunk)=>{
            body += chunk;
        });
        request.on('end', ()=>{
            const novoLivro = JSON.parse(body);
            fs.readFile('livros.json', 'utf8', (err, data) => {
                if(err){
                    response.writeHead(500, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({message: "Não foi possivel acessar os dados" }));
                    return
                }
                const livros = JSON.parse(data)
                novoLivro.id = '1'
                livros.push(novoLivro)

                fs.writeFile('livros.json',JSON.stringify(livros,null, 2), (err)=>{})

                console.log(livros)
                return response.end();
            });
            return response.end();
        })
    } else {
        response.writeHead(404, {"Content-Type": "application/json"});
        response.end(JSON.stringify({message: "Página não encontrada" }));
    }
});

server.listen(PORT, ()=>{
    console.log(`Servidor on http://localhost${PORT}`)

})
    