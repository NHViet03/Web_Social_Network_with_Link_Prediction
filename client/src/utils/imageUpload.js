
export const checkImage = (file) =>{
    let err = ""
    if(!file) return err = "Ảnh không tồn tại"

    if(file.size > 1024*1024)
    err = "Dung lượng ảnh quá lớn, tối đa 1MB"

    if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Định dạng ảnh không hợp lệ";
    
    return err;
}

export const imageUpload = async(images)=>{
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


export const convertBase64ToFile = (base64String, fileName) =>{
    
        const byteString = atob(base64String.split(",")[1]);
        const mimeString = base64String
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const file = new File([ab], fileName, { type: mimeString });

        return file;
}