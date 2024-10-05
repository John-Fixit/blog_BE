const { UserModel } = require("../Models/UserModel");
const { Op } = require("sequelize");


const getAllUsers = async (req, res) => {
  try {
    const data = await UserModel.findAll({
      raw: true,
      attributes: { exclude: ["password", "dob"] },
    });

    res
      ?.status(200)
      ?.json({ status: true, message: "users fetched", data: data });
  } catch (err) {
    res.status(500).send("Internal Server Error. Please try again later.");
  }
};

const userProfile = async (req, res) => {
  try {
    const { userId } = req?.user;

    const data = await UserModel.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ status: true, message: "User profile", data: data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req?.user;
    const { firstName, lastName, email, dob } = req?.body;

    const qResponse = await UserModel.update(
      {
        firstName,
        lastName,
        email,
        dob
      },
      {
        where: {
          id: {
            [Op.eq]: [userId]
          },
        },
      }
    );

    if(qResponse){
        res
          .status(200)
          .json({ status: true, message: "User profile updated successfully" });
    }
    else{
        res.status(403).json({message: "Unable to update profile", status: false})

    }


    //updating of user data here.......
  } catch (err) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const deleteUser =async(req, res)=>{
  try{
    const { userId } = req?.user;
    console.log(userId, req?.user);


    const qResponse = await UserModel.destroy({
      where : {
        id: {
          [Op.eq]: [userId]
        }
      }
    })

    if(qResponse){
      res.status(200).json({status: true, message: "User deleted successfully"})
    }
    else{
      res.status(403).json({status: false, message: "Unable to delete user"})
    }

  }
  catch
  (err){
    res.status(500).json({ status: false, message: "Internal server error" });
  }
}








module.exports = { getAllUsers, userProfile, updateProfile, deleteUser };
