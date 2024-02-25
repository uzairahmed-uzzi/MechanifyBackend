const userModel = require('../schemas/userSchema')
const asyncHandler = require('express-async-handler')

exports.getMechanics=asyncHandler(async(req,res)=>{
    let {longitude,latitude,services}=req.body
    let mechanics=""
    if (services && services.length > 0) {
        let ids=services.map((s,i)=>s.id)
        mechanics = await userModel.find({
            role: "Mechanic",
            "services.id": { $in: ids },
            longitude: { $exists: true, $ne: null }, // Check if longitude exists and is not null
            latitude: { $exists: true, $ne: null }   // Check if latitude exists and is not null
        });
    }
    else{
         mechanics=await userModel.find({ role: "Mechanic"   ,
         longitude: { $exists: true, $ne: null }, 
         latitude: { $exists: true, $ne: null } })
    }
    if(!mechanics){
        res.status(404)
        throw new Error("Mechanics not found")
    }
    let mechanicsWithDistance=mechanics
    if(longitude && latitude){
        
        mechanicsWithDistance = mechanics.map(mechanic => {
            // const distance = geolib.getDistance(
            //     { latitude, longitude },
            //     { latitude: mechanic.latitude, longitude: mechanic.longitude  },
            //     );
            const distance= Math.sqrt((latitude-mechanic.latitude)**2+(longitude-mechanic.longitude)**2)
                return { ...mechanic.toObject(), distance };
            });
            // console.log("Distance----",distance)
            mechanicsWithDistance.sort((a, b) => a.distance - b.distance); 
        }
        let upTo20=mechanicsWithDistance.length>20?mechanicsWithDistance.slice(0,20):mechanicsWithDistance
        res.status(200).send(upTo20)
})