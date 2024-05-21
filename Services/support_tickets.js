const { where } = require('sequelize');
const db = require('../config/mysql');
const utils = require("../utils/index");

exports.SupportTickets = async(idUserToken) => {
    let user = await utils.userType(idUserToken);
    let result;

    switch(user){
        case 1:     //Admin, tem acesso a todos os Tickets que estejam com o estado 
            try{
                result = await db.support_ticket.findAll({
                    where:{
                        support_statesssid: 5,      //Verificar se esta de acordo com a bd
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let museum = await db.usermuseum.findOne({
                    where:{
                        useruid: idUserToken,
                    }
                });
                result = await db.support_ticket.findAll({
                    where:{
                        museummid: museum.museummid,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 3:     //User, tem acesso aos seus tickets
            try{
                result = await db.support_ticket.findAll({
                    where:{
                        useruid: idUserToken,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        default:
            throw new Error("Utilizador nao reconhecido!");            
    }
  
    let response = {
        success: 1,
        length: result.length,
        results: result.map((support_ticket) => {
            return {
                id: support_ticket.stid,
                description: support_ticket.Description,
                statessid: support_ticket.support_statesssid,
                museumid: support_ticket.museummid,
                userid: support_ticket.useruid,
                priority: support_ticket.priority,
                responsible: support_ticket.admin_useruid,
                deadline: support_ticket.deadline,
            };
        }),
    }

    return response;
}
