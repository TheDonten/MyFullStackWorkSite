const actionUpdateElementList = async ({request,params} : any) =>{



    await new Promise( (resolve, reject) =>{
        setTimeout( () =>{
            resolve("Foo");
        }, 2000)
    }).then( (respone) => {
        console.log(respone);
    })

    const formData = await request.formData();
    const newPost = {
        data : formData.getAll("data")
    }
    console.log("NEW POST")
    console.log(newPost);

    return false;
}
export default actionUpdateElementList;