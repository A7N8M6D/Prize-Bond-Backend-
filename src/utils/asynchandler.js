const asynchandler =(requestHandler)=>{
     return (req , res ,next)=>{
        Promise.resolve(requestHandler(req , res , next)).catch((error)=>{return (res.status( error.statsCode || 500 ).json({success:false,message:error.message}))})
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