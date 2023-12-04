
export const checkImage = (file) =>{
    let err = ""
    if(!file) return err = "Ảnh không tồn tại"

    if(file.size > 1024*1024)
    err = "Dung lượng ảnh quá lớn, tối đa 1MB"

    if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Định dạng ảnh không hợp lệ";
    
    return err;
}

export const imageUpload=async(images)=>{
    let imgArr=[];

    for(const image of images){
        const formData=new FormData();
        formData.append("file",image);
        formData.append("upload_preset", "irbytja4");
        formData.append("cloud_name", "dswg5in7u");

        const res=await fetch("https://api.cloudinary.com/v1_1/dswg5in7u/image/upload",{
            method:"POST",
            body:formData
        })

        const data=await res.json();
        imgArr.push({
            public_id:data.public_id,
            url:data.secure_url
        })
    }
    return imgArr;
}
