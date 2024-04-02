class ApiError extends Error{
    constructor(
        statsCode,
        message="Something went Wrong",
        errors=[],
        stack=""
    ){
       super(message)
       this.statsCode=statsCode
       console.log(this.statsCode)
       this.data=null
       this.message=message
       console.log(this.message);
       this.success=false;
       this.errors=errors
       if(stack)
       {
        this.stack=stack
       }
       else
       {
        Error.captureStackTrace(this , this.constructor)
       }
    }
}
export {ApiError}