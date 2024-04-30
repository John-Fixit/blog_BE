const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");

const UserModel = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // role: {
    //     type: DataTypes.ENUM,
    //     values: ['admin', 'user'], // Define the allowed values
    //     allowNull: false
    //   },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 


{ indexes: [{ unique: true, fields: ['email'] }], 
// hooks: {
//     beforeValidate: (payload)=>{
//         if(payload?.firstName){
//             payload.name = payload.name.toLowerCase()
//         }
//     }
// }
})

//synchronize the model with the database
async function syncDatabase(){
    await sequelize.sync({alter: true});
    console.log('Database synchronized.');
}









module.exports = {
    syncDatabase,
    UserModel
}