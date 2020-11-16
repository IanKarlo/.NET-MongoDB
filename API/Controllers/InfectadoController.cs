using API.Data.Collections;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using API.Extra;
using System;

namespace API.Controllers
{   
    [ApiController]
    [Route("[controller]")]
    public class InfectadoController : ControllerBase
    {
        Data.MongoDB _mongoDB;
        IMongoCollection<Infectado> _infectadosCollection;

        

        public InfectadoController(Data.MongoDB mongoDB)
        {
            _mongoDB = mongoDB;
            _infectadosCollection = _mongoDB.DB.GetCollection<Infectado>(typeof(Infectado).Name.ToLower());
        }


        [HttpPost]
        public ActionResult SalvarInfectado([FromBody] InfectadoDto dto)
        {
            
            int identifier = GetSystemID.GetLastID();
            var infectado = new Infectado(dto.DataNascimento, dto.Sexo, dto.Latitude, dto.Longitude, identifier);
            _infectadosCollection.InsertOne(infectado);

            GetSystemID.UpdateID(identifier+1);
            
            return StatusCode(201, $"Infectado adicionado com sucesso com o ID:{identifier}");
        }

        [HttpGet]
        public ActionResult ObterInfectados()
        {
            var infectados = _infectadosCollection.Find(Builders<Infectado>.Filter.Empty).ToList();
            
            return Ok(infectados);
        }

        [HttpPut("{id}")]
        public ActionResult AtualizarInfectado(int id,[FromBody] InfectadoDto dto) 
        {   
            Console.WriteLine(dto);
            var filter = Builders<Infectado>.Filter.Eq("identifier", id);
            var update = Builders<Infectado>.Update.Set("DataNascimento", dto.DataNascimento).Set("Sexo",dto.Sexo);

            _infectadosCollection.UpdateOne(filter,update);

            return Ok("Atualizado com sucesso");
        }

        [HttpDelete("{id}")]
        public ActionResult DeletarInfectado(int id)
        {
            var filter = Builders<Infectado>.Filter.Eq("identifier", id);

            _infectadosCollection.DeleteOne(filter);

            return Ok("Usuário deletado");
        }
    }
}