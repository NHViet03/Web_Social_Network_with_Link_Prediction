const Users = require('../models/userModel');

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async(req, res) => {
        try{
            const { fullname, username, story, gender, birthday, website, email } = req.body;
            if(!fullname) return res.status(400).json({msg: "Vui lòng nhập tên."})
            if(fullname.length > 25) return res.status(400).json({msg: "Tên không được vượt quá 25 ký tự."})
            if(!username) return res.status(400).json({msg: "Vui lòng nhập tên người dùng."})
            if(username.length > 25) return res.status(400).json({msg: "Tên người dùng không được vượt quá 15 ký tự."}) 
            
            await Users.findOneAndUpdate({_id: req.user._id},{
                fullname, username, story, gender, birthday, website, email
            })
            res.json({msg: "Cập nhật thành công!"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = userCtrl;