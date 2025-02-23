import { db } from "../config/connectDatabase.js";


// export const viewAllEquipments =(req,res)=> {
//     res.json({
//         message: "Done",
//     })
// }

/*
export const viewAllEquipments =(req,res)=> {
    const q = "SELECT * FROM equipments";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    } )
}*/


export const viewAllEquipments =(req,res)=> {
    const q = "SELECT * FROM equipments";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    } )
}