// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();
export const checkImage = (file) =>{
    let err = ""
    if(!file) return err = "Ảnh không tồn tại"

    if(file.size > 1024*1024)
    err = "Dung lượng ảnh quá lớn, tối đa 1MB"

    if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Định dạng ảnh không hợp lệ";
    
    return err;
}
export const imageUpload = async (images) => {
    // let imgArr = [];
    // cloudinary.config({
    //     cloud_name: process.env.CLOUD_NAME,
    //     api_key: process.env.CLOUD_API_KEY,
    //     api_secret: process.env.CLOUD_API_SECRET
    // });

    // const uploadPromises = images.map(async (item) => {
    //     return new Promise((resolve, reject) => {
    //         cloudinary.uploader.upload(item.path, { folder: "avatar" }, (err, result) => {
    //             if (err) reject(err);
    //             imgArr.push({ public_id: result.public_id, url: result.secure_url });
    //             resolve();
    //         });
    //     });
    // });

    // await Promise.all(uploadPromises);

    // return imgArr;
}
