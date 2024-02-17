const userModel = require('../schemas/userSchema')
const asyncHandler = require('express-async-handler')

exports.getMechanics=asyncHandler(async(req,res)=>{
    let {longitude,latitude,services}=req.body
    let mechanics=""
    if (services){
        let ids=services.map((s,i)=>s.id)
        mechanics = await userModel.find({
            role: "mechanic",
            "services.id": { $in: ids },
            longitude: { $exists: true, $ne: null }, // Check if longitude exists and is not null
            latitude: { $exists: true, $ne: null }   // Check if latitude exists and is not null
        });
    }
    else{
         mechanics=await userModel.find({ role: "mechanic"   ,
         longitude: { $exists: true, $ne: null }, 
         latitude: { $exists: true, $ne: null } })
    }
    if(!mechanics){
        res.status(404)
        throw new Error("Mechanics not found")
    }
    if(longitude && latitude){
        
        const mechanicsWithDistance = mechanics.map(mechanic => {
            // const distance = geolib.getDistance(
            //     { latitude, longitude },
            //     { latitude: mechanic.latitude, longitude: mechanic.longitude  },
            //     );
            const distance= Math.sqrt((latitude-mechanic.latitude)**2+(longitude-mechanic.longitude)**2)
                return { ...mechanic.toObject(), distance };
            });
            // console.log("Distance----",distance)
            mechanicsWithDistance.sort((a, b) => a.distance - b.distance); 
            let upTo20=mechanicsWithDistance.length>20?mechanicsWithDistance.slice(0,20):mechanicsWithDistance
            res.status(200).send(upTo20)
    }else{
        let upTo20=mechanics.length>20?mechanics.slice(0,20):mechanics
        res.status(200).send(upTo20)
    }
})