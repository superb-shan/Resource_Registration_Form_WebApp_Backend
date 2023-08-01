const Seminar = require('../models/seminar')
const User = require('../models/user')
const moment  = require('moment')
const { v4: uuidv4 } = require('uuid');

const createSeminar = async(req,res)=>{
     try {
        let {name,number,date,startTime,endTime,purpose,no_of_Attendees,seating_capacity,EquipmentRequired,specialRequiremnts} = req.body
        const user = await User.findOne({where:{name:name}})
        if(!user){

            res.status(200).send(JSON.stringify({"message":"user not found"}))
            return ; 
        }
        const dateFormat = "DD-MM-YYYY";
  const timeFormat = "HH:mm:ss";
        const parsedDate = moment(date, dateFormat);
        const parsedStartTime = moment(startTime, timeFormat);
        const parsedEndTime = moment(endTime, timeFormat);
      
        const seminarObj = await Seminar.create({
            id: uuidv4(),
          name: user.name,
          number,
          date: parsedDate.format(dateFormat),
          startTime: parsedStartTime.format(timeFormat),
          endTime: parsedEndTime.format(timeFormat),
          purpose,
          no_of_Attendees,
          seating_capacity,
          EquipmentRequired,
          specialRequiremnts
        });
      
        res.status(200).send(JSON.stringify({ "message": "Seminar created successfully", "seminar": seminarObj }));
      
        
     } catch (error) {
         res.status(200).send(error.message)
     }

}
module.exports ={
    createSeminar:createSeminar
}