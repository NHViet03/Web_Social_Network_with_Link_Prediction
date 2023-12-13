export const fileUpload=async(files)=>{
    let fileArr=[];

    for(const file of files){
        const formData=new FormData();
        formData.append("file",file);
        formData.append("upload_preset", "scpr1y34");
        formData.append("cloud_name", "dswg5in7u");

        const res=await fetch("https://api.cloudinary.com/v1_1/dswg5in7u/image/upload",{
            method:"POST",
            body:formData
        })

        const data=await res.json();
        fileArr.push({
            public_id:data.public_id,
            url:data.secure_url
        })
    }
    return fileArr;
}
