const asynchandler =(requestHandler)=>{
     return (req , res ,next)=>{
        Promise.resolve(requestHandler(req , res , next)).catch((error)=>{next(error)})
     }
}
export {asynchandler}





// const asynchandler=(fn)=> async ( req , res , next)=>{
// try{
//       await fn(re ,res ,next)
// }catch(error)
// {
//    res.status( err.code||500).jason({
//     success:false,
//     message:error.message
//    })
// }
//}